// search bar
var cityInputFormEl = document.querySelector('#city-input-form');//cityFormEl
var searchCityInputEl = document.querySelector('#city-input');//cityInputEl
var savedCityNames = []; //cities

// current forecast
var currentCity = document.querySelector('#current-city'); //citySearchInputEl
var currentWeather = document.querySelector('#current-weather-info')//weatherContainerEl

// 5 days forecast
var forecastTitle = document.querySelector("#forecast-title");
var fiveDayForecast = document.querySelector("#five-day-container");//forecastContainerEl

//for saved elements
var searchedCitiesBtn = document.querySelector("#searched-cities-button");


// set up search bar
var searchCitySubmit = function(event){
    event.preventDefault();
    var cityInput = searchCityInputEl.value.trim(); // city=cityInput
    console.log(cityInput);
    if(cityInput){
        getCityWeather(cityInput);
        getFiveDay(cityInput);
        savedCityNames.unshift({cityInput});
        searchCityInputEl.value="";
    }
    savedSearch();
    savedCities(cityInput);
}


// store search cities
// TODO learn how to set up local storage
var savedSearch = function(){
    localStorage.setItem("savedCityNames", JSON.stringify(savedCityNames));
};

// set up current weather container
var getCityWeather = function(city){
    var apiKey = "e9f9b5974f3e7edbe58e6e2b4a022661"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, cityInput);
        });
    });
};

var displayWeather = function(weather, searchCity){
    // clear content
    currentWeather.textContent= "";  
    currentCity.textContent=searchCity;

    //display date
    var currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    currentCity.appendChild(currentDate);
 
    //weather icon
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    currentCity.appendChild(weatherIcon);
 
    //temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

   //sind speed
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

    //humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
 
    //append to container
    currentWeather.appendChild(temperatureEl);
 
    //append to container
    currentWeather.appendChild(humidityEl);
 
    //append to container
    currentWeather.appendChild(windSpeedEl);
 
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
 }


 var getUvIndex = function(lat,lon){
    var apiKey = "e9f9b5974f3e7edbe58e6e2b4a022661"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}

var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //append index to current weather
    currentWeather.appendChild(uvIndexEl);
}

var getFiveDay = function(city){
    var apiKey = "e9f9b5974f3e7edbe58e6e2b4a022661"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    fiveDayForecast.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumEl);

        // console.log(forecastEl);
       //append to five day container
       fiveDayForecast.appendChild(forecastEl);
    }

}

var savedCities = function(savedCities){
 
    // console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = savedCities;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",savedCities)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

// pastSearch();

cityInputFormEl.addEventListener("submit", searchCitySubmit);
searchedCitiesBtn.addEventListener("click", pastSearchHandler);