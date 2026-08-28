# 카카오맵 API 키 입력

`kakao.config.js` 파일의 `javascriptKey` 값만 교체하세요.

```js
window.KAKAO_MAP_CONFIG = {
  javascriptKey: "실제_JavaScript_키"
};
```

주의:
- REST API 키가 아니라 **JavaScript 키**를 사용합니다.
- 카카오 Developers에서 `http://localhost:5500` 또는 배포 도메인을 Web 플랫폼 도메인으로 등록해야 합니다.
