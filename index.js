let apiKey = "ffaeaa5b1900ce4344e3acf66a4t325o";
let celsiusTemperature = null;

function showCurrent() {
  navigator.geolocation.getCurrentPosition(handleCurrentTemp);
}

function capitalFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleCurrentTemp(response) {
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;
  let url = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  axios.get(url).then(function (locationResponse) {
    let name = locationResponse.data.city;
    let country = locationResponse.data.country;
    let temperature = locationResponse.data.temperature.current;
    let humidity = locationResponse.data.temperature.humidity;
    let wind = locationResponse.data.wind.speed;
    let image = locationResponse.data.condition.icon_url;
    let description = locationResponse.data.condition.description;
    let coordinates = response.coords;
    celsiusTemperature = temperature;

    document.querySelector("#city").innerHTML = `${name}, ${country}`;
    document.querySelector("#temperature").innerHTML = Math.round(temperature);
    document.querySelector("#showWind").innerHTML = Math.round(wind);
    document.querySelector("#showHumidity").innerHTML = Math.round(humidity);
    document.querySelector("#icon").src = image;
    document.querySelector("#description").innerHTML =
      capitalFirstLetter(description);
    getForecast(coordinates);
  });
}
showCurrent();
updateTime(null);

let form = document.querySelector("#form");
form.addEventListener("submit", search);

function search(event) {
  event.preventDefault();
  let input = document.querySelector("#cityinput");
  let cityValue = input.value.trim().toLowerCase();
  let cityRequestURL = `https://api.shecodes.io/weather/v1/current?query=${cityValue}&key=${apiKey}`;
  axios.get(cityRequestURL).then(handleCitySearch);
}

function handleCitySearch(response) {
  let name = response.data.city;
  let country = response.data.country;
  let temperature = response.data.temperature.current;
  let humidity = response.data.temperature.humidity;
  let wind = response.data.wind.speed;
  let image = response.data.condition.icon_url;
  let description = response.data.condition.description;

  celsiusTemperature = temperature;

  updateTime(response.data.time);

  document.querySelector("#city").innerHTML = `${name}, ${country}`;
  document.querySelector("#temperature").innerHTML = Math.round(temperature);
  document.querySelector("#showWind").innerHTML = Math.round(wind);
  document.querySelector("#showHumidity").innerHTML = Math.round(humidity);
  document.querySelector("#icon").src = image;
  document.querySelector("#description").innerHTML =
    capitalFirstLetter(description);
  getForecast(response.data.coordinates);
}

function updateTime(timestamp) {
  let time;
  if (timestamp === null) {
    time = new Date();
  } else {
    time = new Date(timestamp * 1000);
  }

  let hours = time.getHours().toString().padStart(2, "0");
  let minutes = time.getMinutes().toString().padStart(2, "0");
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = days[time.getDay()];
  let dateElement = document.querySelector("#showDate");
  dateElement.innerHTML = `${currentDay}, ${hours}:${minutes}`;
}
function formatDay(time) {
  let date = new Date(time);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "forecast";
  console.log(response.data.daily);

  let forecastHTML = "";
  response.data.daily.slice(1).forEach(function (forecastday, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="card border-light  text-bg-light" style="width: 7rem;">
    <img src="${forecastday.condition.icon_url}" class="card-img-top" alt="${
          forecastday.condition.description
        }">
    <div class="card-body text-center">
      <h5 class="card-title">${formatDay(forecastday.time * 1000)}</h5>
      <p class="card-text forecast-temps">
        <span class="forecast-temp-max"> 
          ${Math.round(forecastday.temperature.maximum)}°
        </span>
        <span class="forecast-temp-min"> 
          ${Math.round(forecastday.temperature.minimum)}°
        </span>
      </p>
    </div>
  </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}
