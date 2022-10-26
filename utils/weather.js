require('dotenv').config();
const axios = require('axios');

async function weather(countryCode) {
  try {
    const data = countryCode || 'Seoul';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${process.env.API_KEY}&lang=kr`;

    const config = {
      headers: { 'content-type': 'application/json' },
    };

    const res = await axios.get(url, config);

    return res.data.weather[0].description;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = weather;
