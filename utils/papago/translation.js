require('dotenv').config();
const axios = require('axios');

async function papago(text, lang) {
  try {
    const client_id = process.env.PAPAGO_ID;
    const client_secret = process.env.PAPAGO_SECRET;

    const url = 'https://openapi.naver.com/v1/papago/n2mt';

    const data = { source: lang, target: 'ko', text: text };

    const config = {
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
      },
    };

    const res = await axios.post(url, data, config);

    return res.data.message.result.translatedText;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = papago;
