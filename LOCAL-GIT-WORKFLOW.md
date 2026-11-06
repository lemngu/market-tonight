# 모래내 PC 개발·배포 순서

프로젝트: market-tonight (이 파일이 있는 폴더)
원격: https://github.com/lemngu/market-tonight
현재 로컬 브랜치: office-local-20261106
현재 운영 주소: https://market-tonight.vercel.app/

## 평소 수정
VS Code에서 이 폴더를 열고 터미널에서 pnpm.cmd dev를 실행합니다. http://localhost:3000/ 과 http://localhost:3000/admin 에서 수정·확인합니다. 이 단계에서는 온라인이 바뀌지 않습니다.

## 최종 확인 후 배포 준비
로컬 관리자의 고객페이지 반영 버튼을 누르면 로컬 공개본이 갱신됩니다. pnpm.cmd release:prepare 를 실행하면 그 공개본과 최신 코드로 docs를 다시 생성합니다. 이 명령은 push하지 않습니다.
원격 docs와 로컬 소스의 diff를 검토하고, pnpm.cmd build가 성공하는지 확인합니다.

## GitHub에 반영 (이 단계에서 운영 배포 시작)
git fetch origin
git status
git diff --stat
git add .
git diff --cached --stat
git commit -m "Update Market Tonight"
git push origin HEAD:main

main 업데이트를 Vercel이 감지하여 재배포합니다. 푸시가 거절되면 강제 푸시하지 말고 원격 변경을 비교·병합합니다. 다른 PC에서 작업한 날에는 먼저 git fetch origin 후 차이를 확인합니다. git pull로 로컬 최신 파일을 덮어쓰지 않습니다.

## 저장되는 항목
GitHub: src, public, scripts, 설정, 공개 배포 파일 docs.
로컬에만 보관: .env.local, .local-data(관리자 초안·원본 사진), node_modules, .next, backup.
다른 PC에 clone만 하면 로컬 초안·비밀키·사진 원본은 복원되지 않습니다. .local-data와 .env.local은 별도로 안전하게 백업·이관합니다.

## 관리자와 온라인 페이지
로컬 관리자 기능은 그대로 사용합니다. 현재 Vercel 서비스는 docs 정적 사이트이므로 온라인 관리자 로그인/저장은 제공하지 않습니다. 온라인 관리자 편집을 원하면 별도 영구 저장소와 인증 연결을 구현해야 합니다.

## 예전 배포 배치 파일
기존 deploy-pages.bat / deploy-github-pages.bat은 gh-pages 강제 푸시 방식이라 현재 Vercel main 배포 흐름과 다릅니다. 사용하지 말고 위 명령을 따릅니다.
