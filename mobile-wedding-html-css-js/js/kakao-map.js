document.addEventListener("DOMContentLoaded", function () {
    const key = WEDDING_CONFIG.KAKAO_JAVASCRIPT_KEY;
    const message = document.getElementById("map-message");
    if (!key || key.includes("여기에_")) {
        message.textContent = "js/config.js에 카카오 JavaScript 키를 입력해 주세요.";
        return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.onload = function () {
        kakao.maps.load(function () {
            const position = new kakao.maps.LatLng(37.5566, 127.0052);
            const map = new kakao.maps.Map(document.getElementById("kakao-map"), { center: position, level: 3 });
            new kakao.maps.Marker({ map: map, position: position });
        });
    };
    script.onerror = () => message.textContent = "API 키와 카카오 개발자 사이트의 등록 도메인을 확인해 주세요.";
    document.head.appendChild(script);
});
