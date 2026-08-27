# 부산 맛집 정보 서비스

HTML, CSS, JavaScript로 제작한 반응형 부산 맛집 탐색 앱입니다.

## 실행
1. VS Code로 폴더를 엽니다.
2. `js/config.js`에서 API 키를 입력합니다.
3. `index.html`을 Live Server로 실행합니다.

처음에는 `USE_SAMPLE_DATA: true`라서 키 없이 기능을 확인할 수 있습니다. 실제 공공데이터를 사용하려면 키를 입력하고 `false`로 바꾸세요.

## 카카오맵
카카오디벨로퍼스에서 카카오맵을 ON으로 설정하고 JavaScript 키의 SDK 도메인에 `http://127.0.0.1:5500`, `http://localhost:5500` 또는 실제 배포 도메인을 등록하세요.

## 파일 구조
```text
busan-food-app/
├── index.html
├── css/style.css
├── js/config.js
├── js/sample-data.js
├── js/app.js
└── README.md
```
