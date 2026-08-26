document.addEventListener("DOMContentLoaded", function () {
    applyKoreanPatch();

    const elements = {
        form: document.getElementById("search-form"),
        input: document.getElementById("city-input"),
        message: document.getElementById("message"),
        locationButton: document.getElementById("location-button"),
        favoriteButton: document.getElementById("favorite-button"),
        refreshButton: document.getElementById("refresh-button"),
        favoriteList: document.getElementById("favorite-list"),
        recentList: document.getElementById("recent-list"),
        savedSection: document.getElementById("saved-section")
    };

    let currentUnit = localStorage.getItem("weather_unit") || "metric";
    let currentWeather = createGimpoSample();
    let recentCities = readStorage("weather_recent");
    let favoriteCities = readStorage("weather_favorites");

    // 김포 예시 데이터를 먼저 화면에 출력
    renderWeather(currentWeather);
    renderSavedCities();
    updateUnitButtons();

    // API Key가 입력되어 있으면 첫 화면에서 김포 실시간 날씨 요청
    if (hasApiKey()) {
        getWeatherByCity(WEATHER_CONFIG.DEFAULT_CITY);
    }

    elements.form.addEventListener("submit", function (event) {
        event.preventDefault();
        const city = elements.input.value.trim();

        if (!city) {
            showMessage(KOREAN_TEXT.searchEmpty, "error");
            return;
        }

        getWeatherByCity(city);
    });

    document.querySelectorAll(".quick-cities button").forEach(function (button) {
        button.addEventListener("click", function () {
            getWeatherByCity(button.dataset.city);
        });
    });

    document.querySelectorAll(".unit-button").forEach(function (button) {
        button.addEventListener("click", function () {
            currentUnit = button.dataset.unit;
            localStorage.setItem("weather_unit", currentUnit);
            updateUnitButtons();
            renderWeather(currentWeather);
        });
    });

    elements.locationButton.addEventListener("click", function () {
        if (!hasApiKey()) return showMessage(KOREAN_TEXT.apiKeyRequired, "error");
        if (!navigator.geolocation) return showMessage(KOREAN_TEXT.locationDenied, "error");

        showMessage(KOREAN_TEXT.loading, "loading");
        navigator.geolocation.getCurrentPosition(
            function (position) {
                getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
            },
            function () {
                showMessage(KOREAN_TEXT.locationDenied, "error");
            }
        );
    });

    elements.favoriteButton.addEventListener("click", toggleFavorite);
    elements.refreshButton.addEventListener("click", function () {
        if (currentWeather.city.apiName) getWeatherByCity(currentWeather.city.apiName);
    });

    async function getWeatherByCity(city) {
        if (!hasApiKey()) return showMessage(KOREAN_TEXT.apiKeyRequired, "error");
        const query = "q=" + encodeURIComponent(city);
        await requestWeather(query);
    }

    async function getWeatherByCoordinates(latitude, longitude) {
        const query = "lat=" + latitude + "&lon=" + longitude;
        await requestWeather(query);
    }

    async function requestWeather(query) {
        showMessage(KOREAN_TEXT.loading, "loading");

        try {
            const common = "&appid=" + WEATHER_CONFIG.OPENWEATHER_API_KEY + "&units=metric&lang=" + WEATHER_CONFIG.LANGUAGE;
            const currentResponse = await fetch("https://api.openweathermap.org/data/2.5/weather?" + query + common);

            if (!currentResponse.ok) {
                if (currentResponse.status === 404) throw new Error(KOREAN_TEXT.cityNotFound);
                throw new Error(KOREAN_TEXT.networkError);
            }

            const currentData = await currentResponse.json();

            // 서버에서 받은 현재 날씨 원본 데이터 먼저 확인
            console.log("OpenWeather 현재 날씨 데이터:", currentData);

            const forecastResponse = await fetch(
                "https://api.openweathermap.org/data/2.5/forecast?lat=" + currentData.coord.lat +
                "&lon=" + currentData.coord.lon + common
            );

            if (!forecastResponse.ok) throw new Error(KOREAN_TEXT.networkError);
            const forecastData = await forecastResponse.json();

            // 서버에서 받은 예보 원본 데이터 먼저 확인
            console.log("OpenWeather 5일 예보 데이터:", forecastData);

            currentWeather = normalizeWeather(currentData, forecastData);
            renderWeather(currentWeather);
            saveRecentCity(currentWeather.city);
            hideMessage();
            elements.input.value = "";
        } catch (error) {
            console.error("날씨 API 오류:", error);
            showMessage(error.message || KOREAN_TEXT.networkError, "error");
        }
    }

    function normalizeWeather(current, forecast) {
        const dayGroups = {};

        forecast.list.forEach(function (item) {
            const dateKey = new Date((item.dt + current.timezone) * 1000).toISOString().slice(0, 10);
            if (!dayGroups[dateKey]) dayGroups[dateKey] = [];
            dayGroups[dateKey].push(item);
        });

        const daily = Object.values(dayGroups).slice(0, 5).map(function (items) {
            const middle = items[Math.floor(items.length / 2)];
            return {
                time: middle.dt,
                min: Math.min(...items.map(item => item.main.temp_min)),
                max: Math.max(...items.map(item => item.main.temp_max)),
                icon: middle.weather[0].icon,
                description: middle.weather[0].description
            };
        });

        return {
            city: { name: current.name, apiName: current.name + "," + current.sys.country, country: current.sys.country },
            timezone: current.timezone,
            current: {
                temp: current.main.temp,
                feels: current.main.feels_like,
                min: current.main.temp_min,
                max: current.main.temp_max,
                description: current.weather[0].description,
                icon: current.weather[0].icon,
                humidity: current.main.humidity,
                wind: current.wind.speed,
                pressure: current.main.pressure,
                visibility: current.visibility / 1000,
                sunrise: current.sys.sunrise,
                sunset: current.sys.sunset
            },
            hourly: forecast.list.slice(0, 8).map(function (item) {
                return { time: item.dt, temp: item.main.temp, icon: item.weather[0].icon, rain: Math.round((item.pop || 0) * 100) };
            }),
            daily: daily,
            isLive: true
        };
    }

    function renderWeather(data) {
        document.getElementById("city-name").textContent = koreanCityName(data.city.name);
        document.getElementById("country-name").textContent = data.city.country;
        document.getElementById("local-time").textContent = formatLocalTime(Math.floor(Date.now() / 1000), data.timezone, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
        document.getElementById("current-temp").textContent = formatTemperature(data.current.temp);
        document.getElementById("feels-temp").textContent = formatTemperature(data.current.feels);
        document.getElementById("max-temp").textContent = formatTemperature(data.current.max);
        document.getElementById("min-temp").textContent = formatTemperature(data.current.min);
        document.getElementById("weather-description").textContent = data.current.description;
        document.getElementById("weather-icon").src = iconUrl(data.current.icon);
        document.getElementById("weather-icon").alt = data.current.description;
        document.getElementById("humidity").textContent = data.current.humidity + "%";
        document.getElementById("wind-speed").textContent = currentUnit === "metric" ? data.current.wind.toFixed(1) + " m/s" : (data.current.wind * 2.237).toFixed(1) + " mph";
        document.getElementById("pressure").textContent = data.current.pressure + " hPa";
        document.getElementById("visibility").textContent = data.current.visibility.toFixed(1) + " km";
        document.getElementById("sunrise").textContent = formatLocalTime(data.current.sunrise, data.timezone, { hour: "2-digit", minute: "2-digit" });
        document.getElementById("sunset").textContent = formatLocalTime(data.current.sunset, data.timezone, { hour: "2-digit", minute: "2-digit" });
        document.getElementById("data-state-text").textContent = data.isLive ? KOREAN_TEXT.liveData : KOREAN_TEXT.sampleData;
        document.getElementById("state-dot").classList.toggle("live", data.isLive);
        renderHourly(data);
        renderDaily(data);
        updateFavoriteButton();
    }

    function renderHourly(data) {
        document.getElementById("hourly-list").innerHTML = data.hourly.map(function (item, index) {
            const label = index === 0 ? KOREAN_TEXT.now : formatLocalTime(item.time, data.timezone, { hour: "2-digit" });
            return `<div class="hour-card ${index === 0 ? "now" : ""}">
                <span>${label}</span>
                <img src="${iconUrl(item.icon)}" alt="날씨 아이콘">
                <strong>${formatTemperature(item.temp)}</strong>
                <small>💧 ${item.rain}%</small>
            </div>`;
        }).join("");
    }

    function renderDaily(data) {
        document.getElementById("daily-list").innerHTML = data.daily.map(function (item, index) {
            const day = index === 0 ? KOREAN_TEXT.today : formatLocalTime(item.time, data.timezone, { weekday: "short" });
            const date = formatLocalTime(item.time, data.timezone, { month: "numeric", day: "numeric" });
            return `<div class="day-row">
                <div class="day-date"><strong>${day}</strong><span>${date}</span></div>
                <div class="day-condition"><img src="${iconUrl(item.icon)}" alt="${item.description}"><span>${item.description}</span></div>
                <div class="day-temps"><strong>${formatTemperature(item.max)}</strong><span>${formatTemperature(item.min)}</span></div>
            </div>`;
        }).join("");
    }

    function toggleFavorite() {
        const key = cityKey(currentWeather.city);
        const exists = favoriteCities.some(city => cityKey(city) === key);
        favoriteCities = exists ? favoriteCities.filter(city => cityKey(city) !== key) : [currentWeather.city, ...favoriteCities];
        localStorage.setItem("weather_favorites", JSON.stringify(favoriteCities));
        updateFavoriteButton();
        renderSavedCities();
    }

    function saveRecentCity(city) {
        recentCities = [city, ...recentCities.filter(item => cityKey(item) !== cityKey(city))].slice(0, 6);
        localStorage.setItem("weather_recent", JSON.stringify(recentCities));
        renderSavedCities();
    }

    function renderSavedCities() {
        elements.savedSection.classList.toggle("show", favoriteCities.length > 0 || recentCities.length > 0);
        elements.favoriteList.innerHTML = createCityButtons(favoriteCities, "♥ ");
        elements.recentList.innerHTML = createCityButtons(recentCities, "");

        elements.savedSection.querySelectorAll("button[data-city]").forEach(function (button) {
            button.addEventListener("click", function () { getWeatherByCity(button.dataset.city); });
        });
    }

    function createCityButtons(cities, prefix) {
        return cities.map(city => `<button type="button" data-city="${city.apiName}">${prefix}${koreanCityName(city.name)} ${city.country}</button>`).join("");
    }

    function updateFavoriteButton() {
        const active = favoriteCities.some(city => cityKey(city) === cityKey(currentWeather.city));
        elements.favoriteButton.classList.toggle("active", active);
        elements.favoriteButton.textContent = active ? "♥" : "♡";
        elements.favoriteButton.setAttribute("aria-label", active ? "즐겨찾기 해제" : "즐겨찾기 추가");
    }

    function updateUnitButtons() {
        document.querySelectorAll(".unit-button").forEach(function (button) {
            button.classList.toggle("active", button.dataset.unit === currentUnit);
        });
    }

    function formatTemperature(value) {
        const converted = currentUnit === "metric" ? value : value * 9 / 5 + 32;
        return Math.round(converted) + "°";
    }

    function formatLocalTime(unix, timezone, options) {
        return new Intl.DateTimeFormat("ko-KR", { ...options, timeZone: "UTC" }).format(new Date((unix + timezone) * 1000));
    }

    function koreanCityName(name) {
        const cityNames = { Gimpo: "김포", Seoul: "서울", Tokyo: "도쿄", Paris: "파리", "New York": "뉴욕" };
        return cityNames[name] || name;
    }

    function iconUrl(icon) { return "https://openweathermap.org/img/wn/" + icon + "@2x.png"; }
    function cityKey(city) { return city.name + "-" + city.country; }
    function hasApiKey() { return WEATHER_CONFIG.OPENWEATHER_API_KEY && !WEATHER_CONFIG.OPENWEATHER_API_KEY.includes("여기에"); }
    function readStorage(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
    function showMessage(text, type) { elements.message.textContent = text; elements.message.className = "message show " + type; }
    function hideMessage() { elements.message.className = "message"; }

    function createGimpoSample() {
        const now = Math.floor(Date.now() / 1000);
        return {
            city: { name: "Gimpo", apiName: "Gimpo,KR", country: "KR" },
            timezone: 32400,
            current: { temp: 25, feels: 26, min: 21, max: 28, description: "맑음", icon: "01d", humidity: 60, wind: 2.4, pressure: 1010, visibility: 10, sunrise: now - 21600, sunset: now + 21600 },
            hourly: Array.from({ length: 8 }, (_, index) => ({ time: now + index * 10800, temp: [25, 27, 28, 26, 24, 23, 22, 23][index], icon: ["01d", "02d", "02d", "03d", "10n", "04n", "03n", "01d"][index], rain: [0, 10, 10, 20, 60, 40, 20, 0][index] })),
            daily: Array.from({ length: 5 }, (_, index) => ({ time: now + index * 86400, min: [21, 20, 19, 21, 22][index], max: [28, 27, 26, 28, 29][index], icon: ["01d", "02d", "10d", "04d", "01d"][index], description: ["맑음", "구름 조금", "비", "흐림", "맑음"][index] })),
            isLive: false
        };
    }
});
