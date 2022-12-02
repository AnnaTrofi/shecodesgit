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
  let url = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  axios.get(url).then(function (locationResponse) {
    let name = locationResponse.data.city;
    let country = locationResponse.data.country;
    let temperature = locationResponse.data.daily[0].temperature.day;
    let humidity = locationResponse.data.daily[0].temperature.humidity;
    let wind = locationResponse.data.daily[0].wind.speed;
    let image = locationResponse.data.daily[0].condition.icon_url;
    let description = locationResponse.data.daily[0].condition.description;

    celsiusTemperature = temperature;

    document.querySelector("#city").innerHTML = `${name}, ${country}`;
    document.querySelector("#temperature").innerHTML = Math.round(temperature);
    document.querySelector("#showWind").innerHTML = Math.round(wind);
    document.querySelector("#showHumidity").innerHTML = Math.round(humidity);
    document.querySelector("#icon").src = image;
    document.querySelector("#description").innerHTML =
      capitalFirstLetter(description);
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

function displayCelsiusTemperature(event) {
  event.preventDefault();

  let fahrenheitElement = document.querySelector("#systemF");
  let celsiusElement = document.querySelector("#systemC");

  // remove the active class from Celsius
  celsiusElement.classList.add("active");

  // add the active class to fahrenheit
  fahrenheitElement.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;

  let fahrenheitElement = document.querySelector("#systemF");
  let celsiusElement = document.querySelector("#systemC");

  // remove the active class from Celsius
  celsiusElement.classList.remove("active");

  // add the active class to fahrenheit
  fahrenheitElement.classList.add("active");

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
}

let fahrenheitLink = document.querySelector("#systemF");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#systemC");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
