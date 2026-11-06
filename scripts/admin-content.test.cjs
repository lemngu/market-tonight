// Run with: node --test scripts/admin-content.test.cjs
// Authentication is mocked only in this process; the app's auth code is untouched.
const { test, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'market-admin-test-'))
process.env.MARKET_DATA_DIRECTORY = directory
process.env.AUTH_URL = 'http://localhost:3100'
let admin = false
const resolve = Module._resolveFilename
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, ...args)
}
const load = Module._load
Module._load = function (name, ...args) {
  if (name === 'server-only') return {}
  if (name === '@/auth') return { isAdmin: async () => admin }
  return load.call(this, name, ...args)
}
require.extensions['.ts'] = function (module, filename) {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: filename,
  }).outputText
  module._compile(output, filename)
}
const { defaultContent } = require('../src/lib/default-content.ts')
const { contentSchema } = require('../src/lib/content-schema.ts')
const { convertImage, sanitizeSVG, readUploadForm, MAX_UPLOAD_BYTES } = require('../src/lib/image-upload.ts')
const { imageTypeForFile } = require('../src/lib/upload-types.ts')
const { isPublishedMedia } = require('../src/lib/published-media.ts')
const { readContent, saveContent } = require('../src/lib/content-store.ts')
const upload = require('../src/app/(frontend)/api/admin/upload/route.ts')
const media = require('../src/app/(frontend)/api/uploads/[filename]/route.ts')
const contentAPI = require('../src/app/(frontend)/api/admin/content/route.ts')
const image = { url: '/api/uploads/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.webp', alt: 'test', width: 32, height: 20 }
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="20"><style>.shape{fill:#f00}</style><rect class="shape" width="32" height="20"/></svg>'
after(() => { assert.ok(path.resolve(directory).startsWith(path.join(os.tmpdir(), 'market-admin-test-'))); fs.rmSync(directory, { recursive: true, force: true }) })

test('retired logo settings are ignored while all other saved content is preserved', () => {
  const old = structuredClone(defaultContent)
  old.site.navigation = { festivalLogo: image, marketLogo: image }
  const parsed = contentSchema.parse(old)
  assert.equal('navigation' in parsed.site, false)
  delete old.site.navigation
  assert.deepEqual(parsed, old)
  assert.equal(isPublishedMedia(parsed, image.url), false)
})
test('SVG paths, gradients, styles and local references render into inert WebP', async () => {
  const result = await convertImage(Buffer.from(svg), 'image/svg+xml')
  assert.equal(result.info.width, 32); assert.equal(result.info.height, 20)
  assert.equal(result.info.format, 'webp'); assert.ok(result.data.length > 0)
  await convertImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><defs><linearGradient id="g"><stop stop-color="#f00"/></linearGradient></defs><path fill="url(#g)" d="M0 0h20v20H0z"/></svg>'), 'image/svg+xml')
})
test('SVG scripts, events, foreign objects, external references, entities and CSS tricks are rejected', () => {
  for (const inner of ['<script>alert(1)</script>', '<rect onload="alert(1)"/>', '<foreignObject/>', '<image href="file:///etc/passwd"/>', '<use href="https://example.com/x.svg#id"/>', '<style>@import "https://example.com";</style>', '<rect fill="url(file:///etc/passwd)"/>', '<style>rect{fill:u\\72l(https://example.com)}</style>']) {
    assert.throws(() => sanitizeSVG(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg">${inner}</svg>`)), inner)
  }
  assert.throws(() => sanitizeSVG(Buffer.from('<!DOCTYPE svg [<!ENTITY test SYSTEM "file:///etc/passwd">]><svg>&test;</svg>')))
})
test('fake MIME, oversized dimensions, empty data, oversize files and chunked oversize bodies are rejected', async () => {
  await assert.rejects(convertImage(Buffer.from(svg), 'image/png'))
  await assert.rejects(convertImage(Buffer.from(svg.replace('width="32"', 'width="20001"')), 'image/svg+xml'))
  await assert.rejects(convertImage(Buffer.alloc(0), 'image/png'))
  await assert.rejects(convertImage(Buffer.alloc(5 * 1024 * 1024 + 1), 'image/png'))
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_UPLOAD_BYTES + 1)); controller.close() } })
  await assert.rejects(readUploadForm(new Request('http://localhost/upload', { method: 'POST', body, duplex: 'half' })), /UPLOAD_TOO_LARGE/)
})
test('all rendered media types become public; hidden posters/stores and unreferenced uploads stay private', () => {
  for (const [group, key] of [['hero', 'image'], ['mapPage', 'image'], ['festivalPage', 'timetable'], ['festival', 'poster']]) {
    const content = structuredClone(defaultContent); content.site[group][key] = image
    assert.equal(isPublishedMedia(content, image.url), true, group + '.' + key)
  }
  const content = structuredClone(defaultContent); content.site.festival.poster = image; content.site.festival.isVisible = false
  assert.equal(isPublishedMedia(content, image.url), false)
  content.stores.push({ id: 'test', name: 'test', menu: '', price: '', hours: '', isVisible: true, image, routeIds: ['budget'] })
  assert.equal(isPublishedMedia(content, image.url), true)
  content.routes[0].isVisible = false
  assert.equal(isPublishedMedia(content, image.url), false)
})
test('authenticated upload, draft privacy, publication, conflict protection and backups', async () => {
  const request = (origin = 'http://localhost:3100') => { const body = new FormData(); body.set('file', new File([svg], 'hero.svg', { type: 'image/svg+xml' })); return new Request('http://localhost:3100/api/admin/upload', { method: 'POST', headers: { origin }, body }) }
  admin = false
  assert.equal((await upload.POST(request())).status, 401)
  assert.equal((await contentAPI.GET(new Request('http://localhost:3100/api/admin/content'))).status, 401)
  admin = true
  assert.equal((await upload.POST(request('http://evil.example'))).status, 403)
  const response = await upload.POST(request()); assert.equal(response.status, 200)
  const uploaded = await response.json(); assert.match(uploaded.url, /^\/api\/uploads\/[a-f0-9-]+\.webp$/)
  const filename = uploaded.url.split('/').at(-1)
  const getMedia = () => media.GET(new Request('http://localhost:3100' + uploaded.url), { params: Promise.resolve({ filename }) })
  const initial = await readContent(); const content = structuredClone(initial.draft); content.site.mapPage.image = uploaded
  const draft = await saveContent(content, initial.revision, false)
  admin = false; assert.equal((await getMedia()).status, 404)
  admin = true; assert.equal((await getMedia()).status, 200)
  const published = await saveContent(content, draft.revision, true)
  admin = false; const result = await getMedia(); assert.equal(result.status, 200); assert.equal(result.headers.get('content-type'), 'image/webp')
  assert.equal(result.headers.get('x-content-type-options'), 'nosniff')
  await assert.rejects(saveContent(content, draft.revision, true), /CONFLICT/)
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory, 'history', `revision-${draft.revision}.json`), 'utf8')).published, draft.published)
  assert.equal((await readContent()).revision, published.revision)
  assert.equal((await media.GET(new Request('http://localhost/'), { params: Promise.resolve({ filename: '../content.json' }) })).status, 404)
})



test('Illustrator metadata, standard version fields and Korean fragment IDs render safely', async () => {
  const source = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 20"><defs><pattern id="새_패턴_견본" width="4" height="4" patternUnits="userSpaceOnUse"><rect data-name="레이어 1" width="4" height="4" fill="#f00"/></pattern></defs><rect data-name="아트워크" width="32" height="20" fill="url(#새_패턴_견본)"/></svg>'
  const result = await convertImage(Buffer.from(source), 'image/svg+xml')
  assert.equal(result.info.width, 32); assert.equal(result.info.height, 20)
  assert.throws(() => sanitizeSVG(Buffer.from(source.replace('url(#새_패턴_견본)', 'url(https://example.com/패턴)'))))
})
test('existing real Illustrator logos and timetable upload successfully', async () => {
  for (const name of ['Korea-Grand-Festival_logo_black.svg', 'Market-Tonight_logo_black.svg', 'event/timetable.svg', 'event/pattern.svg']) {
    const result = await convertImage(fs.readFileSync(path.join(root, 'public/assets', name)), 'image/svg+xml')
    assert.ok(result.info.width > 0 && result.info.height > 0, name)
  }
})
test('Windows exports without MIME retain byte-level verification', async () => {
  assert.equal(imageTypeForFile({name:'외부 일러스트.SVG',type:''}), 'image/svg+xml')
  assert.equal(imageTypeForFile({name:'사진.png',type:'application/octet-stream'}), 'image/png')
  assert.equal(imageTypeForFile({name:'문서.txt',type:''}), null)
  assert.equal(imageTypeForFile({name:'사진.png',type:'text/html'}), null)
  await assert.rejects(convertImage(Buffer.from('<html>fake</html>'), imageTypeForFile({name:'fake.svg',type:''})))
})

test('non-hero copy refresh preserves hero, images, relationships and current timetable', () => {
  const { applySectionCopy } = require('../src/lib/section-copy.ts')
  const content = structuredClone(defaultContent)
  content.site.hero.titleLine1 = '유지할 히어로'
  content.site.hero.image = image
  content.site.festival.poster = image
  content.site.festivalPage.timetable = image
  content.site.mapPage.image = image
  content.site.festivalPage.programs[0].time = '18:15–20:15'
  content.site.festivalPage.programs[0].place = '유지할 행사장'
  content.stores = [{ id: 'preserved-store', name: '기존 점포', menu: '기존 메뉴', price: '', hours: '', image, routeIds: ['budget'], isVisible: true }]
  const next = applySectionCopy(content)
  assert.deepEqual(next.site.hero, content.site.hero)
  assert.deepEqual(next.stores, content.stores)
  assert.deepEqual(next.routes.map(route => [route.id, route.name, route.isVisible]), content.routes.map(route => [route.id, route.name, route.isVisible]))
  assert.deepEqual(next.site.festivalPage.programs.map(program => [program.time, program.place, program.color]), content.site.festivalPage.programs.map(program => [program.time, program.place, program.color]))
  assert.deepEqual([next.site.festival.poster, next.site.festivalPage.timetable, next.site.mapPage.image], [image, image, image])
  assert.equal(next.site.routesSection.browseLabel, '내 취향의 미식루트 찾기')
  assert.equal(next.site.footer.headingLine1, '오늘의 만남이,')
  assert.deepEqual(applySectionCopy(next), next)
})
