const app = require('./app');

const env = process.env;
const PORT = env.PORT || 8080;

app.listen(PORT, () => {
  console.log(PORT);
  console.log(`Server is running on port ${PORT}.`);
});
