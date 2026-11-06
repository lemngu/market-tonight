# Render 배포 준비

현재 상태: 설정 준비 완료. 서비스 생성·결제·온라인 배포는 아직 하지 않았습니다.

## 배포 방법
1. GitHub 비공개 저장소를 준비하고 이 프로젝트 소스를 업로드합니다. .env.local, .local-data, backup, node_modules, .next는 제외합니다. 비밀키는 저장소에 올리지 않습니다.
2. Render 계정을 만들고 GitHub 저장소를 연결합니다. New > Blueprint에서 render.yaml을 사용합니다. 생성 전 Starter 서비스와 1GB 영구 디스크 요금을 확인합니다.
3. AUTH_GOOGLE_ID와 AUTH_GOOGLE_SECRET을 Render 환경변수 입력 화면에 입력합니다. 값은 로컬 .env.local에서 직접 복사합니다. 채팅에 보내지 않습니다. AUTH_SECRET은 새로 생성됩니다.
4. Render의 기본 HTTPS 주소를 확인합니다. 기본 주소는 RENDER_EXTERNAL_URL로 자동 적용됩니다. 커스텀 도메인을 연결하면 AUTH_URL과 NEXT_PUBLIC_SITE_URL을 같은 HTTPS 주소로 설정하고 재배포합니다.
5. Google Cloud Console의 웹 OAuth 클라이언트에 승인된 JavaScript 원본으로 배포 HTTPS 주소, 승인된 리디렉션 URI로 해당 주소 + /api/auth/callback/google 을 추가합니다. 로컬 주소는 유지합니다. OAuth 앱의 테스트/게시 상태와 관리자 계정 허용도 확인합니다.
6. 로그인·공개 페이지·초안 저장·고객페이지 반영·사진 업로드를 확인합니다. 재시작 후에도 수정 내용과 사진이 남는지 확인합니다.

## 현재 콘텐츠 이관
현재 문구·점포·사진은 로컬 .local-data 폴더에 있습니다. 소스 저장소에는 포함하지 않습니다. 배포 계정이 준비되면 이 폴더의 content.json, uploads와 필요 시 history를 Render 영구 디스크 /var/data로 안전하게 옮겨야 현재 내용으로 시작합니다. 이관 전 로컬 폴더를 백업하고, 이관 중 관리자의 저장 작업을 중지합니다. 빈 디스크로 시작하면 기본 콘텐츠가 표시됩니다.

## 운영
단일 서버만 실행합니다. JSON 저장 큐는 단일 프로세스용이며 여러 인스턴스에서 공유하는 방식은 지원하지 않습니다. /var/data의 content.json·uploads·history를 함께 외부 백업합니다. 영구 디스크 서비스는 배포 시 잠깐 중단될 수 있습니다.

## 로컬 확인
pnpm build:deploy

이 명령은 실행 파일을 생성합니다. 배포 실행은 Render의 HTTPS 주소 및 비밀 환경변수가 설정된 환경에서 pnpm start:deploy로 수행합니다. 개발 서버는 기존 pnpm dev를 사용합니다.
