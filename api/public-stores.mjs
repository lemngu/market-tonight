export async function GET() {
  const source = process.env.MARKET_STORES_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbySQN7Em1ys1DDUVGXiXVsSMWf2v9M2CbMa_lbtpQM1zvx3sm8l7fVCShzB_iwUyqRv/exec';
  if (!source || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(source)) {
    return unavailable();
  }

  try {
    const result = await fetch(source, { signal: AbortSignal.timeout(8000) });
    if (!result.ok) return unavailable();
    const data = await result.json();
    if (!Array.isArray(data.stores) || data.stores.length > 2000) return unavailable();

    const stores = data.stores.filter(store => store?.isVisible === true).map(store => ({
      id: store.id,
      name: store.name,
      menu: store.menu,
      menus: store.menus,
      price: store.price,
      hours: store.hours,
      location: store.location,
      routeIds: store.routeIds,
      isVisible: true,
      image: null,
    }));

    return Response.json({ stores }, {
      headers: { 'Cache-Control': 'public, max-age=0', 'Vercel-CDN-Cache-Control': 'max-age=15' },
    });
  } catch {
    return unavailable();
  }
}

function unavailable() {
  return Response.json({ error: '점포 목록을 불러올 수 없습니다.' }, {
    status: 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}

