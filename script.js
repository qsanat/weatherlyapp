const form = document.getElementById("weather-form");
const apiKeyInput = document.getElementById("apiKey");
const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country");
const formMessage = document.getElementById("form-message");
const submitButton = form.querySelector("button[type='submit']");
const weatherCard = document.getElementById("weather-card");
const locationOutput = document.getElementById("result-location");
const conditionOutput = document.getElementById("result-condition");
const tempOutput = document.getElementById("result-temp");
const humidityOutput = document.getElementById("result-humidity");
const windOutput = document.getElementById("result-wind");
const weatherIcon = document.getElementById("weather-icon");

const storedApiKey = sessionStorage.getItem("weatherly-api-key");
if (storedApiKey) {
  apiKeyInput.value = storedApiKey;
}

function setMessage(message, type = "default") {
  formMessage.textContent = message;
  formMessage.classList.remove("is-error", "is-success");

  if (type === "error") {
    formMessage.classList.add("is-error");
  }

  if (type === "success") {
    formMessage.classList.add("is-success");
  }
}

function hideWeather() {
  weatherCard.classList.add("is-hidden");
}

function showWeather(data) {
  const weather = data.weather?.[0];
  const cityName = data.name;
  const countryCode = data.sys?.country;
  const temperature = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const iconCode = weather?.icon;
  const description = weather?.description ?? "Unavailable";
  const condition = weather?.main ?? "Unknown";

  locationOutput.textContent = `${cityName}, ${countryCode}`;
  conditionOutput.textContent = `${condition} · ${description}`;
  tempOutput.textContent = `${temperature}°C`;
  humidityOutput.textContent = `${humidity}%`;
  windOutput.textContent = `${windSpeed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = `${condition} icon`;
  weatherCard.classList.remove("is-hidden");
}

async function fetchWeather(city, country, apiKey) {
  const query = `${city.trim()},${country.trim()}`;
  const endpoint = new URL("https://api.openweathermap.org/data/2.5/weather");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("appid", apiKey);
  endpoint.searchParams.set("units", "metric");

  let response;

  try {
    response = await fetch(endpoint);
  } catch {
    throw new Error("network error");
  }

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || "Unable to fetch weather data right now.";
    throw new Error(message);
  }

  return payload;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  const country = countryInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    hideWeather();
    setMessage("Enter an OpenWeatherMap API key before requesting weather data.", "error");
    return;
  }

  if (!city || !country) {
    hideWeather();
    setMessage("Enter both a city and a country to continue.", "error");
    return;
  }

  sessionStorage.setItem("weatherly-api-key", apiKey);
  submitButton.disabled = true;
  setMessage("Loading current weather...");

  try {
    const weatherData = await fetchWeather(city, country, apiKey);
    showWeather(weatherData);
    setMessage("Weather loaded successfully.", "success");
  } catch (error) {
    hideWeather();

    const rawMessage = error instanceof Error ? error.message : "Unexpected error.";
    const friendlyMessage = /city not found/i.test(rawMessage)
      ? "No matching location was found. Check the city and country and try again."
      : /401|invalid api key/i.test(rawMessage)
        ? "The API key appears to be invalid. Update it and try again."
        : "Weather data could not be loaded. Check your connection and try again.";

    setMessage(friendlyMessage, "error");
  } finally {
    submitButton.disabled = false;
  }
});
