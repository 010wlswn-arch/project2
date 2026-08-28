# 풀인더 Public Pool Finder

HTML + CSS + Vanilla JavaScript로 제작한 반응형 공공 수영장 정보 서비스 예제입니다.

## 화면 구성 — 5개

1. `index.html` — 홈 / 통합검색 / 추천 시설
2. `pools.html` — 지역·시설유형·풀 길이·레인 수 필터 검색
3. `map.html` — 카카오맵 기반 지도 탐색
4. `favorites.html` — 즐겨찾기 저장/삭제
5. `detail.html` — 수영장 상세정보

즉, **4개 이상의 서로 다른 목적과 기능을 가진 화면** 조건을 충족합니다.

## 폴더 구조

```text
poolinder_full_project/
├─ index.html
├─ pools.html
├─ map.html
├─ favorites.html
├─ detail.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ home.js
│  ├─ pools-page.js
│  ├─ map.js
│  ├─ favorites.js
│  ├─ detail.js
│  ├─ data/
│  │  ├─ pools.js
│  │  └─ translations.js
│  └─ modules/
│     └─ common.js
├─ images/
│  └─ pools/
│     ├─ pool-1.svg
│     ├─ pool-2.svg
│     ├─ pool-3.svg
│     └─ README.txt
├─ config/
│  └─ kakao-map/
│     ├─ kakao.config.js
│     └─ README.md
└─ api/
   └─ public-data/
      ├─ public-data.config.js
      ├─ public-data-api.js
      └─ README.md
```

## 실행

VS Code Live Server 또는 Python 서버를 사용하세요.

```bash
py -m http.server 5500
```

브라우저:
`http://localhost:5500`

## 카카오맵 API 키

`config/kakao-map/kakao.config.js`

```js
window.KAKAO_MAP_CONFIG = {
  javascriptKey: "여기에_카카오_JAVASCRIPT_키_입력"
};
```

카카오 Developers에 `http://localhost:5500`과 실제 배포 도메인을 Web 플랫폼으로 등록하세요.

## 공공데이터 API

`api/public-data/public-data.config.js`에서:

```js
enabled: true,
endpoint: "공공데이터_API_ENDPOINT",
serviceKey: "서비스키"
```

API마다 응답 필드명이 다르므로 `public-data-api.js`의
`normalizePublicPoolData()`에서 필요한 데이터만 선택해 객체 구조로 변환하면 됩니다.

## 데이터 관리

`js/data/pools.js`

- `POOL_DATA`는 **배열**
- 각 수영장 정보는 **객체**
- 다국어 수영장명은 다시 `name` 객체로 관리

예:
```js
{
  id: "pool-001",
  name: {
    ko: "양곡문화체육센터 수영장",
    en: "Yanggok Culture & Sports Center Pool"
  },
  region: "김포시",
  poolLength: 25,
  lanes: 6
}
```

화면에는 검색/필터 조건과 해당 페이지 목적에 필요한 값만 선택해서 출력합니다.

## 언어

상단 언어 버튼:
- 한국어
- English
- 日本語
- 中文

선택 언어는 `localStorage`에 저장되어 페이지를 이동하거나 새로고침해도 유지됩니다.

## 즐겨찾기

브라우저 `localStorage`에 저장합니다.

## 안내 / 성공 / 오류 메시지

- 검색조건 적용 성공
- 즐겨찾기 추가/삭제 성공
- 위치 권한 성공/오류
- 공공데이터 API 성공/오류
- 카카오맵 API 미설정 안내
- 검색 결과 없음 안내

## 실제 수영장 사진 교체

`images/pools/` 폴더에 JPG/PNG/WebP 파일을 넣고
`js/data/pools.js`의 `image` 경로를 변경하세요.

예:
```js
image: "./images/pools/yanggok.jpg"
```

## 모바일

940px / 620px 기준 반응형 미디어쿼리가 포함되어 있으며:
- 모바일 햄버거 메뉴
- 1열 수영장 카드
- 모바일용 필터 폼
- 지도 상하 배치
- 상세페이지 1열 배치
로 변경됩니다.


## 업로드 공공데이터 반영 (확장판)
- 문화체육관광부 전국공공체육시설 현황 수영장 시트: **492개 시설 레코드 추출** → `js/data/facilities.js`
- 원주시 드림체육관 강습: 9개
- 안성시국민체육센터 강습: 33개
- 세종시 전체수영장 강습: 110개
- 강습 데이터 합계: **152개** → `js/data/programs.js`
- `classes.html`: 강습 프로그램 전용 검색/필터 화면
- `facilities.html`: 업로드 전국 수영장 시설 데이터 탐색 화면

강습 데이터는 출처 파일의 기준일이 서로 다르므로 각 카드에 데이터 기준일을 표시합니다. 실제 신청 가능 여부는 운영기관 최신 공지를 확인해야 합니다.
