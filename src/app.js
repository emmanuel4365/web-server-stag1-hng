const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
// const helmet = require("helmet");
// const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.set("trust proxy", true);

app.use(morgan("dev"));
// app.use(helmet());
// app.use(cors());
app.use(express.json());

app.get("/api/hello", async (req, res) => {
  try {
    let queryData = req.query;
    // console.log(queryData);

    let clientIP = req.ip;
    // req.socket.remoteAddress || req.headers["x-forwarded-for"];

    let ipResponse = await axios.get("https://ipapi.co/json/");

    let location = ipResponse;
    // console.log(location);

    let weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.data.city}&appid=fec2e968bd33b3fd04023b0be3ecd320&units=metric`
    );

    // console.log(weather);

    res.status(200).json({
      client_ip: clientIP,
      location: location.data.city,
      greeting: `Hello, ${
        queryData.visitor_name
      }!, the temperature is ${Math.ceil(
        weather.data.main.temp
      )} degrees Celcius in ${location.data.city}`,
    });
  } catch (error) {
    res.status(500).send("Something went wrong! Please check and try again.");
  }
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
