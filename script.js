const API_KEY = "3a7d535d4b370c0757685fc32687f0a7";

const form = document.getElementById("form");
const cityInput = document.getElementById("cityInput");
const geoBtn = document.getElementById("geoBtn");
const themeBtn = document.getElementById("themeBtn");

const placeName = document.getElementById("placeName");
const placeMeta = document.getElementById("placeMeta");
const weatherIcon = document.getElementById("weatherIcon");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feels = document.getElementById("feels");
const status = document.getElementById("status");
const result = document.getElementById("result");
const themeIcon = document.getElementById("themeIcon");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        status.textContent = "Digite uma cidade.";
        return;
    }

    searchCity(city);
});

geoBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
        status.textContent = "Geolocalização não suportada no seu navegador.";
        return;
    }

    status.textContent = "Obtendo localização...";
    result.classList.add("hidden");

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            searchByCoords(lat, lon);
        },
        function (error) {
            console.log("Erro de geolocalização:", error);

            if (error.code === 1) {
                status.textContent = "Permissão de localização negada.";
            } else if (error.code === 2) {
                status.textContent = "Localização indisponível.";
            } else if (error.code === 3) {
                status.textContent = "Tempo esgotado ao obter localização.";
            } else {
                status.textContent = "Não foi possível obter sua localização.";
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});

async function searchCity(city) {
    console.log("Buscando cidade:", city);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`;

    status.textContent = "Buscando...";
    result.classList.add("hidden");

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.cod !== 200) {
            status.textContent = "Cidade não encontrada.";
            return;
        }

        placeName.textContent = data.name;
        placeMeta.textContent = data.sys.country;
        temp.textContent = Math.round(data.main.temp);
        desc.textContent = data.weather[0].description;
        humidity.textContent = data.main.humidity;
        wind.textContent = data.wind.speed;
        feels.textContent = Math.round(data.main.feels_like);

        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        status.textContent = "";
        result.classList.remove("hidden");

    } catch (error) {
        console.log("Erro ao buscar dados:", error);
        status.textContent = "Erro ao buscar dados.";
    }
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(savedTheme);
}

updateThemeIcon();

themeBtn.addEventListener("click", function () {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }

    updateThemeIcon();
});

function updateThemeIcon() {
    if (document.body.classList.contains("dark")) {
        themeIcon.className = "bi bi-sun";
    } else {
        themeIcon.className = "bi bi-moon";
    }
}
async function searchByCoords(lat, lon) {
    console.log("Buscando por coordenadas:", lat, lon);

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

    status.textContent = "Buscando clima da sua localização...";
    result.classList.add("hidden");

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.cod !== 200) {
            status.textContent = "Não foi possível buscar sua localização.";
            return;
        }

        placeName.textContent = data.name;
        placeMeta.textContent = data.sys.country;
        temp.textContent = Math.round(data.main.temp);
        desc.textContent = data.weather[0].description;
        humidity.textContent = data.main.humidity;
        wind.textContent = data.wind.speed;
        feels.textContent = Math.round(data.main.feels_like);

        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        status.textContent = "";
        result.classList.remove("hidden");
    } catch (error) {
        console.log("Erro ao buscar dados da localização:", error);
        status.textContent = "Erro ao buscar dados da localização.";
    }
}
