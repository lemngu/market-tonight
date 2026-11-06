# Google 관리자 로그인 설정

현재 프로젝트는 로컬 PC의 단일 Next.js 서버에서 사용하는 관리 기능입니다.
관리자로 허용되는 계정은 `lmg07142000@gmail.com` 하나입니다.
인증되지 않은 사용자와 다른 Google 계정은 관리자 화면·초안·저장·업로드·백업 API를 사용할 수 없습니다.

## Google OAuth 연결

1. Google Cloud Console에서 프로젝트를 선택하거나 새로 만듭니다.
2. Google Auth Platform의 Branding/Audience에서 앱 정보를 설정합니다.
3. 테스트 모드이면 Test users에 `lmg07142000@gmail.com`을 추가합니다.
4. Clients에서 OAuth 클라이언트를 만들고 유형은 Web application으로 선택합니다.
5. Authorized JavaScript origins에 `http://localhost:3000`을 등록합니다.
6. Authorized redirect URIs에 아래 주소를 정확히 등록합니다.

   `http://localhost:3000/api/auth/callback/google`

7. 프로젝트의 `.env.local`에서 다음 두 항목에 발급받은 값을 직접 입력합니다.

   ```dotenv
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   ```

   `ADMIN_EMAIL`과 `AUTH_URL`은 미리 설정되어 있습니다. `AUTH_SECRET`은 생성되어 있으며 다시 공유할 필요가 없습니다.
   비밀키는 채팅·Git·스크린샷에 올리지 마세요. `.env.local`은 Git에서 제외됩니다.

8. 실행 중인 서버에서 Ctrl+C를 누르고 `pnpm.cmd dev`로 다시 시작합니다.
9. `http://localhost:3000/admin`으로 접속해 허용된 Google 계정으로 로그인합니다.

로그인은 localhost 주소를 사용하세요. 홈페이지는 127.0.0.1에서도 볼 수 있지만 로그인 쿠키는 호스트 간 공유되지 않습니다.

## 편집과 공개

- 문구·사진·디자인: 사이트 이름, 검색 제목·소개, 메뉴명, 첫 화면, 맛길·점포 안내, 행사 표시 여부와 내용, 대표 사진·포스터, 하단 문구, 색상, 기본 글자 크기, 기관 띠 속도.
- 미식루트: 추가, 이름·설명·목록 소개·재료 안내 편집, 공개 여부, 순서 변경.
- 점포: 추가·수정, 노출상태, 대표 상품, 사진, 가격대, 영업시간, 여러 미식루트 선택.
- 임시저장: 초안만 저장하며 방문자 화면에는 반영하지 않습니다.
- 고객페이지 반영: 현재 편집 내용 전체를 공개합니다. 방문자가 새로고침하면 최신 내용을 받습니다.
- 점포 편집 창의 '편집 내용 적용'은 편집 중인 초안에만 적용합니다. 이후 임시저장 또는 고객페이지 반영을 누르세요.
- 테마를 비공개로 하면 그 테마는 방문자에게 표시하지 않습니다. 공개 테마에 연결되지 않은 점포도 표시하지 않습니다.
- 데이터 백업: 저장된 초안과 공개본을 JSON으로 내려받습니다. 사진 원본 파일은 별도입니다.

## 데이터 보관 및 복구

- `.local-data/content.json`: 저장된 초안과 공개본.
- `.local-data/history/`: 이전 저장본. 동시 편집은 revision 충돌 검사로 덮어쓰기를 방지합니다.
- `.local-data/uploads/`: 업로드한 사진. JPG·PNG·WebP를 검증 후 WebP로 변환합니다.
- 사진은 공개 콘텐츠가 참조하기 전까지 로그인한 관리자에게만 제공됩니다.
- 서버를 재시작해도 파일이 남아 있으므로 저장 내용은 유지됩니다.
- 전체 백업에는 `.local-data` 폴더를 통째로 안전한 위치에 복사하세요. `.env.local`은 별도로 안전하게 보관하세요.
- 변경 전 소스는 `backup/admin-upgrade-*` 폴더에 보관합니다.
- 이전 공개본 복구는 관리자 화면의 '현재 공개본 불러오기'를 이용할 수 있습니다. 더 오래된 버전은 서버를 중지한 뒤 history의 원하는 JSON 파일을 content.json으로 복사하여 복구합니다.

현재 JSON 파일 저장 방식은 단일 PC·단일 서버용입니다. 서버리스 배포나 여러 서버에서 운영할 때는 공유 DB와 영구 파일 저장소로 옮겨야 합니다. Google OAuth에도 운영 도메인의 콜백 주소를 별도로 등록해야 합니다.

## 검증 범위

실제 Google OAuth 로그인은 본인 계정의 클라이언트 ID·비밀키를 설정한 후 최종 확인해야 합니다.
구현 참고: https://authjs.dev/getting-started/providers/google
