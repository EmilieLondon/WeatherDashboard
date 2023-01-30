// API Key
let apiKey = "82c5cfb47d6e85cd369108ab5201240b";

// DOM elements

let cityButtons = document.querySelector(".city-buttons");
let weatherToday = document.querySelector("#today");

let cities = [];


// check the local storage and render city list
init();
function init() {
  let savedCities = JSON.parse(localStorage.getItem("cities"));
  if (savedCities) {
    cities = savedCities;
  }
  renderCities(cities);
}

//create buttons
function renderCities(cities) {
  cityButtons.innerHTML = "";
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    let cityButton = document.createElement("li");
    cityButton.innerHTML = city;
    cityButtons.prepend(cityButton);
  }
}

// Formatting search button and pushing cities
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
      let city = searchInput.value;
        if (!cities.includes(city)) {
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
    if (event.target.matches("li")) {
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
    });

//obtaining weather icon
function renderWeather(weatherData) {
  let cityName = weatherData.city.name;
  let iconCode = weatherData.list[0].weather[0].icon;
  let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  console.log(cityName);
  let html = `<h1>${cityName} (${moment(weatherData.dt).format(
    "DD/MM/YYYY"
  )}) <img src='${iconURL}'></h1>
  <p>Temp: ${Math.floor(weatherData.list[0].main.temp)} &#8451</p>
  <p>Wind</p>
  <p>Humidity</p>`;

  weatherToday.innerHTML = html;
}}