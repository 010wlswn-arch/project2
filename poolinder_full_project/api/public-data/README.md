# 공공데이터 API 연결 폴더

1. `public-data.config.js`에서 `enabled: true`
2. `endpoint` 입력
3. `serviceKey` 입력
4. API 응답 필드에 맞춰 `public-data-api.js`의 `normalizePublicPoolData()` 매핑 수정

이 프로젝트는 전체 API 응답을 그대로 화면에 뿌리지 않고,
`id, name, region, address, type, poolLength, lanes, openToday, parking, latitude, longitude...`
등 화면에 필요한 데이터만 선택해 객체로 변환합니다.

브라우저에서 CORS 오류가 발생하는 공공 API라면 별도 백엔드 프록시가 필요합니다.
