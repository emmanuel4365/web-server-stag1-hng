const express = require("express");

const hello = require("./hello");

const axios = require("axios");

const router = express.Router();

router.get("/api/hello", async (req, res) => {
  try {
    let queryData = req.query;
    // console.log(queryData);

    let clientIP = req.socket.remoteAddress || req.headers["x-forwarded-for"];

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

router.use("/hello", hello);

module.exports = router;
