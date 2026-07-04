# WEATHERLY

WEATHERLY is a static, client-side weather app built with HTML, CSS, and vanilla JavaScript.

## Features

- Look up current weather by city and country
- Display temperature, weather condition, humidity, and wind speed
- Use OpenWeatherMap condition icons
- Show friendly inline messages for empty inputs, invalid locations, API key issues, and network errors
- Responsive minimalist interface for mobile, tablet, and desktop

## Files

- `index.html`
- `styles.css`
- `script.js`

## Run locally

1. Open `index.html` in a browser.
2. Enter your OpenWeatherMap API key in the app.
3. Enter a city and country, then select `Get Weather`.

## API

This app uses the OpenWeatherMap Current Weather endpoint:

`https://api.openweathermap.org/data/2.5/weather`

Get an API key from OpenWeatherMap:

`https://openweathermap.org/api`

## Notes

- The API key is stored in `sessionStorage` for convenience during the current browser session only.
- This is a front-end-only app and does not require a build step or backend.
