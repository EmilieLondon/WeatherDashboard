// API Key
let apiKey = "82c5cfb47d6e85cd369108ab5201240b";

// DOM elements
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let cityButtons = document.querySelector(".city-buttons");
let weatherToday = document.querySelector("#today");
let weatherForecast = document.querySelector("#forecast");

let cities = [];


// check the local storage and render city list
init();
function init() {
  let savedCities = JSON.parse(localStorage.getItem("cities"));
  if (savedCities) {
    cities = savedCities;
  }
  renderCities(cities);


 // Displaying saved data
 let storedWeatherToday = JSON.parse(localStorage.getItem("weatherToday"));
 if (storedWeatherToday) {
   renderWeather(storedWeatherToday);
 }

 let forecast = (weatherForecast.innerHTML =
   localStorage.getItem("forecastHTML"));
  if (forecast) {
   forecastHTML = forecast;
 }
}

//create city buttons
function renderCities(cities) {
  cityButtons.innerHTML = "";
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    let cityButton = document.createElement("button");
    cityButton.innerHTML = city;
    cityButtons.prepend(cityButton);
  }
}

// Formatting search button and pushing cities
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    weatherForecast.innerHTML= "";
      let city = searchInput.value;
      weatherSearch(city);
        if (city !== "" && !cities.includes(city)) {
      cities.push(city);
      savedCities();
    }

//using local storage to save and retrieve cities
function savedCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
  }
  renderCities(cities);
});

//Formating city buttons to trigger weather search
cityButtons.addEventListener("click", function (event) {
    weatherForecast.innerHTML= "";
    if (event.target.matches("button")) {
      console.log(event.target);
      let cityName = event.target.textContent;
      console.log(cityName);
      weatherSearch(cityName);
    }
  });

  function weatherSearch(cityName) {
      // linking 2 URLs to obtain required data
  let queryURL1 =
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=` +
    apiKey;
  
    fetch(queryURL1)
    .then((response) => response.json())
    .then((citiesFound) => {
      let firstCity = citiesFound[0];
      console.log(firstCity);
      console.log(firstCity.lat);
      console.log(firstCity.lon);

      let queryURL2 =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${firstCity.lat}&lon=${firstCity.lon}&units=metric&appid=` +
        apiKey;

      return fetch(queryURL2);
    })

    .then((response) => response.json())
    .then((cityData) => {
      console.log(cityData);
      renderWeather(cityData);
      storeWeatherToday(cityData);
    });
forecastSearch(apiKey, cityName, weatherForecast);
  }

//obtaining weather icon
function renderWeather(weatherData) {
  let cityName = weatherData.city.name;
  let iconCode = weatherData.list[0].weather[0].icon;
  let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  console.log(cityName);
  let htmlWeatherToday = `<h1>${cityName} (${moment(weatherData.dt).format(
    "DD/MM/YYYY"
  )}) <img src='${iconURL}'></h1>
  <p>Temperature: ${Math.floor(weatherData.list[0].main.temp)} &#8451</p>
  <p>Wind speed: ${Math.floor(weatherData.list[0].wind.speed)} knots</p>
  <p>Humidity: ${Math.floor(weatherData.list[0].main.humidity)}%</p>`;

  weatherToday.innerHTML = htmlWeatherToday;
}

// saving data to local storage
function storeWeatherToday(cityData) {
    localStorage.setItem("weatherToday", JSON.stringify(cityData));
  }

  // obtaining data for forecast
function forecastData(apiKey, cityName, weatherForecast) {
    let queryURL3 =
      `https://api.openweathermap.org/data/2.5/forecast?q=` +
      cityName +
      `&units=metric&appid=` +
      apiKey;
  
    fetch(queryURL3)
      .then((response) => response.json())
      .then(function (response5Day) {
          const filteredList = response5Day.list.filter(function (item) {
          return item.dt_txt.endsWith("12:00:00");
        });
        console.log("filteredList", filteredList);
  
        renderForecast(filteredList, weatherForecast, response5Day);
      });
  }

  // saving in local storage
  function storeWeatherToday(cityData) {
    localStorage.setItem("weatherToday", JSON.stringify(cityData));
  }

  function renderForecast(filteredList, weatherForecast, response5Day) {
    // obtaining weather forecast every day at the same time
    for (let i = 0; i < 5; i++) {
      console.log(moment(filteredList[i].dt, "X").format("DD/MM/YYYY, HH:mm:ss"));
  
      // obtaining weather icon
      let iconCode = response5Day.list[i].weather[0].icon;
      console.log(iconCode);
      let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
      console.log(iconURL);
  
      // displaying forecast
      let forecastWeather = `${moment(filteredList[i].dt, "X").format(
          "DD/MM/YYYY"
        )}
        <img src='${iconURL}'>
        <p>Temperature: ${Math.floor(
          filteredList[i].main.temp
        )} &#8451</p>
        <p>Wind speed: ${filteredList[i].wind.speed} knots</p>
        <p>Humidity: ${filteredList[i].main.humidity}%</p>
      </div>`;
  
      weatherForecast.innerHTML += forecastWeather;
    }
    // Storing forecast
    localStorage.setItem("forecastHTML", weatherForecast.innerHTML);
  }