// Paste into the Apps Script project bound to the website store spreadsheet.
const STORE_SHEET_ID = '1nZfd7rY245ofh-uKZqQDoc6XMAnhOKV6hsULb0oSj8c';
const STORE_COLUMNS = ['공개 상태', '점포명', '대표 메뉴', '선택 메뉴', '가격', '영업시간', '위치', '미식루트', '점포 ID'];
const ROUTE_IDS = {
  '만 원 안의 행복': 'budget',
  '글루텐 프리': 'gluten-free',
  '불맛 산책': 'grill',
  '비건 보물 찾기': 'vegan',
  '겨울 간식 산책': 'winter',
};

function doGet() {
  try {
    const result = Sheets.Spreadsheets.Values.get(STORE_SHEET_ID, "'웹사이트 점포'!A1:J2001", {
      valueRenderOption: 'FORMATTED_VALUE',
    });
    const [headers = [], ...rows] = result.values ?? [];
    if (!STORE_COLUMNS.every((header, index) => headers[index] === header)) {
      throw new Error('Store headers changed');
    }
    return json({ stores: publicStores(rows, headers[9] === '점포 사진 (Drive 링크)') });
  } catch (error) {
    console.error('Store feed could not be read');
    return json({ error: 'Store feed is unavailable' });
  }
}

function publicStores(rows, photosEnabled) {
  const seen = new Set();
  const stores = [];
  for (const row of rows) {
    const [visibility, name, menu, menuList, price, hours, location, themes, explicitId] = STORE_COLUMNS.map((_, index) => String(row[index] ?? '').trim());
    if (visibility !== '공개' || !name || name.length > 160 || name === '작성 예시' || explicitId === 'example') continue;
    const routeIds = [...new Set(themes.split(/[,\n]+/).map(theme => ROUTE_IDS[theme.trim()]).filter(id => typeof id === 'string'))];
    if (!routeIds.length) continue;
    const id = /^[a-zA-Z0-9_-]{1,94}$/.test(explicitId)
      ? 'sheet-' + explicitId
      : 'sheet-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, name + '\n' + location, Utilities.Charset.UTF_8)).replace(/=+$/, '');
    if (seen.has(id)) continue;
    seen.add(id);
    const menus = [...new Set(menuList.split(/[,\n]+/).map(item => item.trim().slice(0, 160)).filter(Boolean))].slice(0, 100);
    stores.push({
      id, name, isVisible: true, routeIds, image: null, menus,
      photoLink: photosEnabled ? String(row[9] ?? '').trim().slice(0, 2000) : '',
      menu: menu.slice(0, 4000), price: price.slice(0, 4000),
      hours: hours.slice(0, 4000), location: location.slice(0, 4000),
    });
  }
  return stores;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

