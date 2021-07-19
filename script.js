const cityInputEl = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
const historyEl = document.querySelector('#history');
const weatherIcon= document.querySelector('#weather-icon');
const currentCityText = document.querySelector('#current-city');
const currentCityWeatherEl = document.querySelector('current-city-container');
const temperature= document.querySelector('#temperature');
const windSpeed= document.querySelector('#wind-speed');
const humidity= document.querySelector('#humidity');
const UV = document.querySelector('#UV-index');

const formSubmit = function(event){
    event.preventDefault();
    if(city){
        getCityWeather(city);
        getFiveDaysWeather(city);

    }
}

const getCityWeather = function(city){
    var apiKey = "e9f9b5974f3e7edbe58e6e2b4a022661"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response)) {
        response.json()
        .then(function(data){
            displayWeather(date, city);
        })
    }
}

const displayWeather = function(weather, searchCity){
    currentCityWeatherEl.textContent= "";
    currentCityText.textContent=searchCity;

    console.log(weather);
}