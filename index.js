let apiKey = "c8735bb7e8e2f8d8a38c7501f3cd47d3";
let time = new Date();
let hours = time.getHours().toString().padStart(2, "0");
let minutes = time.getMinutes().toString().padStart(2, "0");
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let currentDay = days[time.getDay()];
let dateElement = document.querySelector("#showDate");
dateElement.innerHTML = `${currentDay}, ${hours}:${minutes}`;

function search(event) {
  event.preventDefault();
  let input = document.querySelector("#cityinput");
  let cityValue = input.value.trim().toLowerCase();
  let cityRequestURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=5&appid=${apiKey}`;
  axios.get(cityRequestURL).then(handleCitySearch);
}

function searchCurrent() {
  navigator.geolocation.getCurrentPosition(handleCurrentSearch);
}

function handleCurrentSearch(response) {
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;

  let url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  axios.get(url).then(function (locationResponse) {
    let name = locationResponse.data[0].name;
    let country = locationResponse.data[0].country;

    let weatherRequestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(weatherRequestURL).then(function (weatherResponse) {
      document.querySelector("#city").innerHTML = `${name}, ${country}`;
      document.querySelector("#temperature").innerHTML = Math.round(
        weatherResponse.data.current.temp
      );
    });
  });
}
function handleCitySearch(response) {
  let name = response.data[0].name;
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let country = response.data[0].country;
  let weatherRequestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(weatherRequestURL).then(function (weatherResponse) {
    document.querySelector("#city").innerHTML = `${name}, ${country}`;
    document.querySelector("#temperature").innerHTML = Math.round(
      weatherResponse.data.current.temp
    );
  });
}

let form = document.querySelector("#form");
form.addEventListener("submit", search);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", searchCurrent);
