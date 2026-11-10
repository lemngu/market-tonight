import { createHash } from 'node:crypto';

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const ID = /^[a-zA-Z0-9_-]{1,100}$/;

const FEED_TTL_MS = 10_000;
const PHOTO_TTL_SECONDS = 30;
let feedCache;

export async function GET(request) {
  const source = process.env.MARKET_STORES_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbySQN7Em1ys1DDUVGXiXVsSMWf2v9M2CbMa_lbtpQM1zvx3sm8l7fVCShzB_iwUyqRv/exec';
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(source)) return unavailable();

  try {
    const query = request ? new URL(request.url).searchParams : new URLSearchParams();
    const photoId = query.get('photo');
    const version = query.get('v');
    if (photoId !== null && (!ID.test(photoId) || (version !== null && !/^[a-f0-9]{24}$/.test(version)))) return missingPhoto();

    const published = await readPublishedStores(source);
    if (photoId !== null) {
      const store = published.find(store => store.id === photoId);
      const photo = publicPhoto(store?.photoLink);
      if (!photo || (version !== null && version !== photo.version)) return missingPhoto();
      return servePhoto(photo.download, version !== null);
    }

    const stores = published.map(store => {
      const photo = publicPhoto(store.photoLink);
      return {
        id: store.id, name: store.name, menu: store.menu, menus: store.menus,
        price: store.price, hours: store.hours, location: store.location, routeIds: store.routeIds,
        isVisible: true,
        image: photo ? {
          url: '/api/public-stores?photo=' + store.id + '&v=' + photo.version,
          alt: store.name + ' 점포 사진',
          width: 800,
          height: 800,
        } : null,
      };
    });

    return Response.json({ stores }, { headers: cacheHeaders() });
  } catch {
    return unavailable();
  }
}

async function readPublishedStores(source) {
  if (feedCache?.source === source && (feedCache.pending || Date.now() < feedCache.expiresAt)) return feedCache.pending || feedCache.stores;

  const entry = { source, pending: fetchPublishedStores(source) };
  feedCache = entry;
  try {
    entry.stores = await entry.pending;
    entry.expiresAt = Date.now() + FEED_TTL_MS;
    return entry.stores;
  } finally {
    entry.pending = null;
  }
}

async function fetchPublishedStores(source) {
  const result = await fetch(source, { signal: AbortSignal.timeout(8000) });
  if (!result.ok) throw new Error('Store feed unavailable');
  const { stores } = await result.json();
  if (!Array.isArray(stores) || stores.length > 2000) throw new Error('Invalid store feed');
  return stores.filter(store => store?.isVisible === true && typeof store.id === 'string' && ID.test(store.id));
}

function publicPhoto(value) {
  if (typeof value !== 'string' || !value.startsWith('https://drive.google.com/')) return null;
  let source;
  try { source = new URL(value); } catch { return null; }
  const file = source.pathname.match(/^\/file\/d\/([^/]+)(?:\/|$)/)?.[1]
    ?? (['/open', '/uc'].includes(source.pathname) ? source.searchParams.get('id') : null);
  if (!file || !/^[A-Za-z0-9_-]{10,100}$/.test(file)) return null;
  const download = new URL('https://drive.usercontent.google.com/download');
  download.searchParams.set('id', file);
  download.searchParams.set('export', 'download');
  const key = source.searchParams.get('resourcekey');
  if (key && /^[A-Za-z0-9_-]{1,100}$/.test(key)) download.searchParams.set('resourcekey', key);
  const version = createHash('sha256').update(download.href).digest('hex').slice(0, 24);
  return { download, version };
}

async function servePhoto(url, versioned) {
  const signal = AbortSignal.timeout(5000);
  try {
    for (let hop = 0; hop < 3; hop++) {
      const response = await fetch(url, { redirect: 'manual', signal });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        await response.body?.cancel();
        if (!location) return missingPhoto();
        url = new URL(location, url);
        if (url.protocol !== 'https:' || url.username || url.password || url.port ||
          !(url.hostname === 'drive.google.com' || url.hostname.endsWith('.googleusercontent.com'))) return missingPhoto();
        continue;
      }
      const type = response.headers.get('content-type')?.split(';')[0];
      if (!response.ok || !['image/jpeg', 'image/png', 'image/webp'].includes(type) ||
          Number(response.headers.get('content-length')) > MAX_PHOTO_BYTES || !response.body) {
        await response.body?.cancel();
        return missingPhoto();
      }
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_PHOTO_BYTES) { await reader.cancel(); return missingPhoto(); }
        chunks.push(value);
      }
      const bytes = Buffer.concat(chunks);
      const valid = type === 'image/jpeg' ? bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
        : type === 'image/png' ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
      if (!valid) return missingPhoto();
      return new Response(bytes, { headers: { ...cacheHeaders(versioned), 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' } });
    }
  } catch {
    // Unshared, deleted or temporarily unavailable Drive files use the modal placeholder.
  }
  return missingPhoto();
}

function cacheHeaders(versioned = false) {
  return {
    'Cache-Control': versioned ? 'public, max-age=15' : 'public, max-age=0',
    'Vercel-CDN-Cache-Control': 'max-age=' + (versioned ? PHOTO_TTL_SECONDS : 15),
  };
}

function missingPhoto() {
  return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
}

function unavailable() {
  return Response.json({ error: '점포 목록을 불러올 수 없습니다.' }, {
    status: 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}

