# 웹사이트 점포 운영표 연결

운영표는 [Google 스프레드시트](https://docs.google.com/spreadsheets/d/1nZfd7rY245ofh-uKZqQDoc6XMAnhOKV6hsULb0oSj8c/edit)에서 편집합니다.

1. 시트의 확장 프로그램 → Apps Script에서 `deploy/market-stores.gs`를 붙여넣습니다. 프로젝트 설정에서 매니페스트를 표시하고, appsscript.json에 deploy/market-stores.appsscript.json의 내용을 붙여넣고 저장합니다.
2. 새 배포 → 웹 앱에서 실행 사용자는 본인, 액세스는 모든 사용자로 설정합니다. 이 웹 앱은 공개로 선택한 점포의 지정 열만 JSON으로 응답합니다. 시트 공유 설정은 그대로 둡니다.
3. 현재 웹 앱의 공개 `/exec` 주소는 api/public-stores.mjs에 기본값으로 연결했습니다. 웹 앱을 교체할 때만 기본값을 바꾸거나 MARKET_STORES_WEB_APP_URL을 설정합니다.
4. node scripts/prepare-release.mjs로 공개 파일을 생성해 배포합니다. 이후에는 시트 편집만으로 반영됩니다.
5. 비공개 예시가 사이트에 나타나지 않는지 확인합니다. 테스트용 점포를 공개한 뒤 홈페이지와 미식루트 페이지에 나타나는지 확인하고, 비공개로 되돌려 내려가는지 확인합니다.

사이트는 화면이 열려 있는 동안 30초 간격으로 목록을 읽습니다. 서버 캐시가 최대 15초 적용됩니다.
점포명과 미식루트가 있는 공개 행을 읽습니다. 최대 2,000행까지 지원합니다. 목록 연동은 메뉴·가격·영업시간·위치·미식루트에 적용됩니다.

