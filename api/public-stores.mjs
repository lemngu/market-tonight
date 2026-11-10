const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const ID = /^[a-zA-Z0-9_-]{1,100}$/;

export async function GET(request) {
  const source = process.env.MARKET_STORES_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbySQN7Em1ys1DDUVGXiXVsSMWf2v9M2CbMa_lbtpQM1zvx3sm8l7fVCShzB_iwUyqRv/exec';
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(source)) return unavailable();

  try {
    const result = await fetch(source, { signal: AbortSignal.timeout(8000) });
    if (!result.ok) return unavailable();
    const data = await result.json();
    if (!Array.isArray(data.stores) || data.stores.length > 2000) return unavailable();

    const published = data.stores.filter(store => store?.isVisible === true && typeof store.id === 'string' && ID.test(store.id));
    const photoId = request && new URL(request.url).searchParams.get('photo');
    if (photoId !== null && photoId !== undefined) {
      const store = published.find(store => store.id === photoId);
      const link = driveDownloadUrl(store?.photoLink);
      return link ? servePhoto(link) : missingPhoto();
    }

    const stores = published.map(store => ({
      id: store.id,
      name: store.name,
      menu: store.menu,
      menus: store.menus,
      price: store.price,
      hours: store.hours,
      location: store.location,
      routeIds: store.routeIds,
      isVisible: true,
      image: driveDownloadUrl(store.photoLink) ? {
        url: '/api/public-stores?photo=' + store.id,
        alt: store.name + ' 점포 사진',
        width: 800,
        height: 800,
      } : null,
    }));

    return Response.json({ stores }, { headers: cacheHeaders() });
  } catch {
    return unavailable();
  }
}

function driveDownloadUrl(value) {
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
  return download;
}

async function servePhoto(url) {
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
      return new Response(bytes, { headers: { ...cacheHeaders(), 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' } });
    }
  } catch {
    // Unshared, deleted or temporarily unavailable Drive files use the modal placeholder.
  }
  return missingPhoto();
}

function cacheHeaders() {
  return { 'Cache-Control': 'public, max-age=0', 'Vercel-CDN-Cache-Control': 'max-age=15' };
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

