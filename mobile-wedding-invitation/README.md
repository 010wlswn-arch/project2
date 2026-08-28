# 민혁 ♥ 서영 모바일 청첩장

HTML, CSS, JavaScript로 제작한 모바일 퍼스트 청첩장입니다. 별도 빌드 과정 없이 실행할 수 있으며, Google Sheets 방명록과 카카오톡 공유 기능을 사용자가 직접 연결할 수 있습니다.

> 이름, 전화번호, 주소, 예식장과 계좌번호는 포트폴리오용 가상 정보입니다.

## 1. 구현 화면

| 화면 | 파일 | 주요 기능 |
|---|---|---|
| 초대 | `index.html` | 메인 사진, 초대 문구, 실시간 카운트다운, 공유 |
| 이야기 | `story.html` | 두 사람의 타임라인과 추억 사진 |
| 사진 | `gallery.html` | 7장 갤러리, 사진 확대 모달, ESC·배경 닫기 |
| 안내 | `venue.html` | 예식 정보, 교통·주차, 주소 복사, 전화·문자 |
| 방명록 | `guestbook.html` | Google Sheets 저장·조회, 계좌 펼치기·복사 |

모든 화면은 하단 탭 메뉴로 이동합니다. 스크롤 시 요소가 아래에서 위로 부드럽게 나타나며, 운영체제에서 동작 줄이기를 설정한 경우 애니메이션을 자동으로 제거합니다.

## 2. 폴더 구성

```text
mobile-wedding-invitation/
├─ index.html
├─ story.html
├─ gallery.html
├─ venue.html
├─ guestbook.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ config.js
│  ├─ main.js
│  └─ guestbook.js
├─ images/
│  ├─ main_wedding.webp
│  ├─ memory_garden.webp
│  ├─ memory_sunset.webp
│  ├─ memory_cafe.webp
│  ├─ memory_rain.webp
│  ├─ rings.webp
│  └─ bouquet.webp
├─ apps-script/
│  └─ Code.gs
└─ docs/
   └─ mobile_wedding_invitation_PRD.docx
```

## 3. 실행 방법

VS Code에서 폴더를 연 뒤 Live Server 확장 프로그램을 사용하는 방법이 가장 간단합니다.

1. VS Code에서 `mobile-wedding-invitation` 폴더를 엽니다.
2. `index.html`을 마우스 오른쪽 버튼으로 클릭합니다.
3. `Open with Live Server`를 선택합니다.
4. 브라우저 개발자 도구의 모바일 화면(360px, 390px, 430px)으로 확인합니다.

`file://`로 직접 열 수도 있지만 Clipboard API와 외부 연동은 로컬 서버에서 더 안정적입니다.

## 4. 청첩장 정보 변경

- HTML 문구·이름·전화번호: 각 HTML 파일에서 수정
- 예식 날짜: `js/config.js`의 `weddingDate` 수정
- 예식장: `js/config.js`의 `venue` 및 `venue.html` 수정
- 사진: 같은 파일명으로 `images` 폴더의 WebP 파일 교체

예식 날짜는 시간대가 포함된 ISO 형식으로 입력합니다.

```javascript
weddingDate: "2026-10-17T14:00:00+09:00"
```

`+09:00`을 넣어야 접속 지역과 관계없이 한국 시간 기준으로 정확하게 계산됩니다.

## 5. Google Sheets 방명록 연결

### 5-1. 스프레드시트 만들기

1. 새 Google 스프레드시트를 만듭니다.
2. 시트 이름을 정확히 `guestbook`으로 변경합니다.
3. 첫 번째 행에 아래 제목을 순서대로 입력합니다.

```text
createdAt | name | message | side | approved | id
```

4. 스프레드시트 주소에서 `/d/`와 `/edit` 사이의 값을 복사합니다. 이것이 `SPREADSHEET_ID`입니다.

### 5-2. Apps Script 설정

1. 스프레드시트 메뉴에서 `확장 프로그램 → Apps Script`를 엽니다.
2. 기본 코드를 지우고 `apps-script/Code.gs`의 전체 코드를 붙여 넣습니다.
3. Apps Script 왼쪽의 `프로젝트 설정`을 엽니다.
4. `스크립트 속성`에서 새 속성을 추가합니다.
   - 속성: `SPREADSHEET_ID`
   - 값: 앞에서 복사한 스프레드시트 ID
5. 저장합니다.

### 5-3. 웹 앱 배포

1. 오른쪽 위 `배포 → 새 배포`를 선택합니다.
2. 유형은 `웹 앱`을 선택합니다.
3. 실행 사용자는 `나`로 설정합니다.
4. 액세스 사용자는 공개 청첩장이라면 `모든 사용자`로 설정합니다.
5. 권한을 승인한 후 생성된 `/exec` 주소를 복사합니다.
6. `js/config.js`에 붙여 넣습니다.

```javascript
googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbzM4C1Gl08xr-a0GsgDprWXns3qqaMSB9JeHt1EtvGiLNOE3SGfDP7LQ8IqBfwc7t_J/exec"
```

### 5-4. 승인 후 공개

새 메시지는 시트의 `approved` 열에 `FALSE`로 저장됩니다. 검토 후 공개할 메시지의 값을 `TRUE`로 변경하면 방명록 목록에 나타납니다. 대문자 TRUE 또는 Google Sheets 체크박스의 선택 상태를 사용하세요.

Apps Script 코드를 수정한 경우 기존 배포를 `새 버전`으로 다시 배포해야 반영됩니다.

## 6. 카카오톡 공유 API 연결

1. Kakao Developers에서 애플리케이션을 만듭니다.
2. `앱 키`에서 **JavaScript 키**를 복사합니다. REST API 키가 아닙니다.
3. `플랫폼 → Web`에서 사용할 주소를 등록합니다.
   - 로컬 테스트 예: `http://127.0.0.1:5500`
   - 배포 예: `https://사용자명.github.io`
4. `js/config.js`에 JavaScript 키를 입력합니다.

```javascript
kakaoJavaScriptKey: "발급받은_JAVASCRIPT_키"
```

도메인은 경로를 제외한 프로토콜과 호스트만 등록합니다. 키가 비어 있거나 SDK 로딩에 실패하면 안내 메시지가 표시되고 나머지 청첩장 기능은 계속 작동합니다.

## 7. 주요 JavaScript 이벤트

- 스크롤: `IntersectionObserver`로 reveal 애니메이션 실행
- 카운트다운: 1초마다 일·시간·분·초 갱신, 탭 복귀 시 오차 보정
- 버튼 클릭: 공유, 복사, 계좌 펼치기, 갤러리 모달
- 입력: 메시지 글자 수 실시간 표시
- 선택: 신랑 측·신부 측·두 사람의 지인 구분
- 제출: 유효성 검사 후 Google Apps Script로 저장
- 키보드: 갤러리 모달을 ESC로 닫기

## 8. 오류 확인과 해결

개발자 도구는 `F12 → Console`에서 확인합니다. 코드에서는 주요 오류를 `console.error()`로 기록하고 사용자 화면에는 이해하기 쉬운 문구를 표시합니다.

| 증상 | 확인할 항목 |
|---|---|
| 사진이 안 보임 | 파일명 대소문자와 `./images/` 경로 확인 |
| 방명록 저장 실패 | `/exec` URL, 웹 앱 접근 권한, 새 버전 배포 확인 |
| 목록이 비어 있음 | `approved` 값이 TRUE인지 확인 |
| CORS 또는 Failed to fetch | `Content-Type: text/plain` 유지, Apps Script 접근 권한 확인 |
| 카카오 공유 실패 | JavaScript 키인지, 현재 도메인이 등록됐는지 확인 |
| 카운트다운 이상 | 날짜에 `+09:00` 포함 여부 확인 |
| 복사가 안 됨 | HTTPS 또는 Live Server에서 실행하고 직접 복사 안내 확인 |

## 9. 배포

GitHub 저장소에 이 폴더의 내용을 업로드한 뒤 `Settings → Pages`에서 배포 브랜치와 루트 폴더를 선택합니다. 배포 후 생성된 HTTPS 주소를 카카오 Web 플랫폼 도메인에 추가합니다.

## 10. 사용한 외부 기능

- Kakao JavaScript SDK: 카카오톡 공유용(키 입력 전에는 비활성)
- Google Apps Script: 정적 웹페이지와 Google Sheets 사이의 방명록 API

갤러리와 애니메이션은 외부 라이브러리 없이 순수 JavaScript로 구현해 네트워크 장애에도 핵심 화면이 작동합니다.

## 11. 개인정보·운영 주의사항

- 현재 데이터는 모두 가상 정보입니다. 실제 사용 전 교체하세요.
- 민감한 비밀키나 Google 계정 인증 정보를 JavaScript에 넣지 마세요.
- 방명록에는 연락처를 수집하지 않으며 이름과 메시지만 최소한으로 저장합니다.
- 공개 전 운영자는 부적절한 메시지를 검토하고 `approved` 값으로 승인합니다.
