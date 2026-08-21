원본 Marble Roulette + 광고 제거 배포 파일

이 ZIP은 원본 LazyGyu Marble Roulette 소스를 GitHub Actions에서 직접 받아
광고/분석 코드만 제거한 뒤 GitHub Pages에 배포합니다.

원본에서 유지되는 것
- 인터페이스
- 맵
- Box2D 물리
- 카메라
- 구슬/이름 기능
- First / Last 등 기능

제거되는 것
- 시작 전 광고
- 결과 광고
- 광고 서버 연결
- Umami 분석 코드

사용 방법
1. ZIP 압축을 풉니다.
2. .github 폴더와 scripts 폴더를 현재 roulette GitHub 저장소 최상단에 업로드합니다.
3. GitHub 저장소 Settings > Pages로 이동합니다.
4. Source를 'GitHub Actions'로 변경합니다.
5. 저장소의 Actions 탭에서 배포 작업이 끝날 때까지 기다립니다.
6. 기존 https://sod109.github.io/roulette/ 주소로 접속합니다.

중요
- 원본 저장소: https://github.com/lazygyu/roulette
- 원본 라이선스: MIT
- 배포 결과에도 원본 LICENSE를 포함하도록 설정되어 있습니다.
