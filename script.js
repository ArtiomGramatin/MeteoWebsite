const apiKey = 'b61d3f42c307ed45a83c9f184336c803';
let currentCity = 'Chișinău';  
let weatherData = null;
let currentDayIndex = 0;
let language = 'ro';

const translations = {
    ro: {
        weatherFor: 'Vremea pentru',
        search: 'Caută',
        hourlyInfo: 'Informații orare',
        temperature: 'Temperatura: ',
        precipitation: 'Precipitații: ',
        conditions: {
            "Clear": "Cer senin",
            "Clouds": "Înnorat",
            "Rain": "Plouă",
            "Drizzle": "Ploaie măruntă",
            "Thunderstorm": "Furtună",
            "Snow": "Ninsoare",
            "Mist": "Ceață",
            "Fog": "Ceață",
            "Smoke": "Fum",
            "Dust": "Praful",
            "Sand": "Nisip",
            "Ash": "Cenușă",
            "Squall": "Vânt puternic",
            "Tornado": "Tornadă"
        }
    },
    en: {
        weatherFor: 'Weather for',
        search: 'Search',
        hourlyInfo: 'Hourly Information',
        temperature: 'Temperature: ',
        precipitation: 'Precipitation: ',
        conditions: {
            "Clear": "Clear sky",
            "Clouds": "Cloudy",
            "Rain": "Rain",
            "Drizzle": "Drizzle",
            "Thunderstorm": "Thunderstorm",
            "Snow": "Snow",
            "Mist": "Mist",
            "Fog": "Fog",
            "Smoke": "Smoke",
            "Dust": "Dust",
            "Sand": "Sand",
            "Ash": "Ash",
            "Squall": "Squall",
            "Tornado": "Tornado"
        }
    }
};

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert(language === 'ro' ? "Eroare la preluarea datelor: " + error : "Error fetching data: " + error);
        throw error;
    }
}

function updateWeatherDisplay(data) {
    document.getElementById('city-name').textContent = data.city.name;
    const dayForecast = data.list[currentDayIndex * 8];
    document.getElementById('weekday-date').textContent = new Date(dayForecast.dt_txt).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('temperature').textContent = translations[language].temperature + `${dayForecast.main.temp}°C`;
    document.getElementById('precipitation').textContent = translations[language].precipitation + translations[language].conditions[dayForecast.weather[0].main];

    const hourlyDetails = document.getElementById('hourly-details');
    hourlyDetails.innerHTML = '';
    for (let i = currentDayIndex * 8; i < (currentDayIndex + 1) * 8; i++) {
        const hourlyData = data.list[i];
        const time = new Date(hourlyData.dt_txt);
        const timeString = time.toLocaleTimeString(language === 'ro' ? 'ro-RO' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        const nextDay = time.getDate() !== new Date().getDate() ? ` (următoarea zi)` : '';
        hourlyDetails.innerHTML += `<div>${timeString}${nextDay}: ${hourlyData.main.temp}°C, ${translations[language].conditions[hourlyData.weather[0].main]}</div>`;
    }
}

function updateWeatherForCity(city) {
    fetchWeatherData(city).then(data => {
        weatherData = data;
        currentDayIndex = 0;
        updateWeatherDisplay(data);
    }).catch(error => {
        console.error(language === 'ro' ? 'Eroare la preluarea datelor: ' : 'Error fetching data: ', error);
    });
}

document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-search').value.trim();
    if (city) {
        updateWeatherForCity(city);
    }
});

document.getElementById('prev-day').addEventListener('click', () => {
    if (currentDayIndex > 0) {
        currentDayIndex--;
        updateWeatherDisplay(weatherData);
    }
});

document.getElementById('next-day').addEventListener('click', () => {
    if (currentDayIndex < 4) {
        currentDayIndex++;
        updateWeatherDisplay(weatherData);
    }
});

document.getElementById('language-toggle').addEventListener('click', () => {
    language = language === 'ro' ? 'en' : 'ro';
    document.getElementById('language-toggle').textContent = language === 'ro' ? 'EN' : 'RO';
    updateTranslations();
    updateWeatherDisplay(weatherData);
});

function updateTranslations() {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        element.textContent = translations[language][key];
    });
}

updateWeatherForCity(currentCity);
