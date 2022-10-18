require('dotenv').config();
const requestPromise = require('request-promise');

async function weather(countryCode) {
  try {
    const q = countryCode || 'Seoul';
    const options = {
      url: `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${process.env.API_KEY}&lang=kr`,
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    };

    let res = await requestPromise(options);
    res = JSON.parse(res);
    const weather = res.weather[0].description;
    return weather;
  } catch (err) {
    return null;
  }
}

module.exports = weather;
