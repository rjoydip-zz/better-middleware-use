const express = require('express');

const app = express();

app.config = {
  PORT: 3000,
  ENV: process.env.NODE_ENV || 'development',
  HOST: '127.0.0.1'
};

const midOne = (req, res, next) => {
  console.log("midOne");
  next();
}

const midTwo = (req, res, next) => {
  console.log("midTwo");
  next();
}

app.use((req, res, next) => {
  console.log(1);
  next();
});

app.use((req, res, next) => {
  console.log(2);
  next();
});

app.get('/', [midOne, midTwo], (req, res) => {
  res.send("Root");
});

app.get('/home', [midTwo], (req, res) => {
  res.send("Home");
});

app.listen(8080, () => {
  console.log(app.config);
  console.log("Server is running on port 8080");
});
