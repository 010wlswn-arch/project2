// 한글 패치 파일
// 화면 문구를 바꾸고 싶다면 오른쪽 따옴표 안의 한글만 수정하세요.
const KOREAN_TEXT = {
    worldWeather: "WORLD WEATHER",
    mainTitle: "오늘, 세상은 어떤 날씨일까요?",
    mainDescription: "도시를 검색하거나 현재 위치의 날씨를 확인해 보세요.",
    quickSearch: "빠른 검색",
    feelsLike: "체감",
    maximum: "최고",
    minimum: "최저",
    humidity: "습도",
    humidityNote: "현재 대기 습도",
    windSpeed: "풍속",
    windNote: "바람의 속도",
    pressure: "기압",
    pressureNote: "해면 기압",
    visibility: "가시거리",
    visibilityNote: "시야 확보 거리",
    sunrise: "일출",
    sunriseNote: "해가 뜨는 시간",
    sunset: "일몰",
    sunsetNote: "해가 지는 시간",
    hourlyForecast: "시간대별 예보",
    fiveDayForecast: "5일간 날씨",
    favorites: "즐겨찾는 도시",
    recentSearch: "최근 검색",
    footerText: "OpenWeather 데이터를 기반으로 제공됩니다.",
    refresh: "새로고침",
    now: "지금",
    today: "오늘",
    searchEmpty: "도시명을 입력해 주세요.",
    cityNotFound: "도시를 찾을 수 없습니다. 철자를 확인해 주세요.",
    apiKeyRequired: "js/config.js에 OpenWeather API Key를 입력해 주세요.",
    locationDenied: "위치 권한이 필요합니다. 도시를 직접 검색해 주세요.",
    networkError: "날씨 정보를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.",
    loading: "날씨 정보를 불러오는 중입니다.",
    liveData: "OpenWeather 실시간 데이터",
    sampleData: "김포 예시 데이터"
};

function applyKoreanPatch() {
    document.querySelectorAll("[data-text]").forEach(function (element) {
        const key = element.dataset.text;
        if (KOREAN_TEXT[key]) element.textContent = KOREAN_TEXT[key];
    });
}
