(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const config = window.WEDDING_CONFIG || {};
    const key = config.kakaoJavaScriptKey;
    const venue = config.venue || {};
    const mapElement = document.getElementById("kakao-map");
    const message = document.getElementById("map-message");

    if (!mapElement) return;

    function showError(text, error) {
      message.textContent = text;
      if (error) console.error("카카오맵 오류:", error);
    }

    if (!key || key.includes("여기에_")) {
      showError("js/config.js에 카카오 JavaScript 키를 입력해 주세요.");
      return;
    }

    if (!Number.isFinite(Number(venue.lat)) || !Number.isFinite(Number(venue.lng))) {
      showError("js/config.js의 예식장 위도와 경도를 확인해 주세요.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;

    script.onload = function () {
      try {
        if (!window.kakao || !kakao.maps) throw new Error("Kakao Maps SDK가 없습니다.");

        kakao.maps.load(function () {
          try {
            const position = new kakao.maps.LatLng(Number(venue.lat), Number(venue.lng));
            const map = new kakao.maps.Map(mapElement, {
              center: position,
              level: 3
            });

            const marker = new kakao.maps.Marker({ map: map, position: position });

            const infoWindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:8px 10px;min-width:170px;text-align:center;font-size:12px;line-height:1.5">${venue.name || "예식장"}</div>`
            });
            infoWindow.open(map, marker);

            message.textContent = "";
            window.addEventListener("resize", function () {
              map.relayout();
              map.setCenter(position);
            });
          } catch (mapError) {
            showError("지도를 표시하지 못했습니다. 좌표와 도메인 설정을 확인해 주세요.", mapError);
          }
        });
      } catch (sdkError) {
        showError("카카오맵 SDK 초기화에 실패했습니다.", sdkError);
      }
    };

    script.onerror = function () {
      showError("카카오맵을 불러오지 못했습니다. JavaScript 키와 등록 도메인을 확인해 주세요.");
    };

    document.head.appendChild(script);
  });
})();
