const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function getRandomImageURL() {
    const images = [
        "images/image.png",
        "images/new.jpg",
        "images/new4.jpg",
        "images/new5.jpg",
        "images/new6.jpg",
        "images/new7.jpg",
        "images/new9.jpg",
        "images/new10.jpg",
        // Add more image URLs here
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";

    const getCurrentWeather = (callback) => {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

        https.get(currentUrl, function (currentResponse) {
            let currentData = "";
            currentResponse.on("data", function (chunk) {
                currentData += chunk;
            });
            currentResponse.on("end", function () {
                try {
                    const currentWeatherData = JSON.parse(currentData);
                    const temp = currentWeatherData.main.temp;
                    const description = currentWeatherData.weather[0].description;
                    const place = currentWeatherData.name;
                    const icon = currentWeatherData.weather[0].icon;
                    const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                    const humidity = currentWeatherData.main.humidity;
                    const rainPercentage = currentWeatherData.clouds.all;
                    const sunrise = new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                    const sunset = new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

                    const getAirQuality = () => {
                        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&appid=${apiKey}`;

                        https.get(airQualityUrl, function (airQualityResponse) {
                            let airQualityData = "";
                            airQualityResponse.on("data", function (chunk) {
                                airQualityData += chunk;
                            });
                            airQualityResponse.on("end", function () {
                                try {
                                    const airQualityJson = JSON.parse(airQualityData);
                                    const airQualityIndex = airQualityJson.list[0].main.aqi;

                                    let airQualityText = "";
                                    if (airQualityIndex === 1) {
                                        airQualityText = "Good";
                                    } else if (airQualityIndex === 2) {
                                        airQualityText = "Fair";
                                    } else if (airQualityIndex === 3) {
                                        airQualityText = "Moderate";
                                    } else if (airQualityIndex === 4) {
                                        airQualityText = "Poor";
                                    } else if (airQualityIndex === 5) {
                                        airQualityText = "Very Poor";
                                    } else {
                                        airQualityText = "N/A";
                                    }

                                    callback(null, { temp, description, place, imageURL, humidity, rainPercentage, sunrise, sunset, airQuality: airQualityText });
                                } catch (error) {
                                    callback("Error parsing air quality JSON:", null);
                                }
                            });
                        }).on("error", function (error) {
                            callback("Error retrieving air quality data:", null);
                        });
                    };

                    getAirQuality();
                } catch (error) {
                    callback("Error parsing current weather JSON:", null);
                }
            });
        }).on("error", function (error) {
            callback("Error retrieving current weather data:", null);
        });
    };

    getCurrentWeather(function (currentError, currentData) {
        if (currentError) {
            console.log(currentError);
            res.send("An error occurred while fetching current weather data.");
        } else {
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.write('<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&display=swap" rel="stylesheet">');
            res.write("<style>");
            res.write("body {");
            res.write("  padding: 100px 100px;");
            const randomImageURL = getRandomImageURL();
            res.write(`  background-image: url(${randomImageURL});`);
            res.write("  background-size: cover;");
            res.write("}");
            
            res.write(".content-box {");
            res.write("  display: flex;");
            res.write("  flex-direction: column;");
            res.write("  justify-content: center;");
            res.write("  align-items: center;");
            res.write("  background: rgba(255, 255, 255, 0.45);");
            res.write("  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);");
            res.write("  backdrop-filter: blur(9px);");
            res.write("  -webkit-backdrop-filter: blur(9px);");
            res.write("  border-radius: 10px;");
            res.write("  border: 1px solid rgba(255, 255, 255, 0.18);");
            res.write("}");
            
            res.write(".data-box {");
            res.write("  display: flex;");
            res.write("  flex-direction: row;");
            res.write("  justify-content: space-between;");
            res.write("  align-items: center;");
            res.write("  padding: 0px 100px;");
            res.write("}");
            
            res.write(".box {");
            res.write("  display: grid;");
            res.write("  padding: 10px 50px;");
            res.write("}");
            
            res.write("h2, h1, h3, p {");
            res.write("  font-family: 'Chakra Petch', sans-serif;");
            res.write("}");
            
            res.write("img {");
            res.write("  max-width: 300px;");
            res.write("  height: 100px;");
            res.write("}");
            
            res.write("@media (max-width: 1028px) {");
            res.write("  .content-box {");
            res.write("    padding: 10px 60px;");
            res.write("    margin-top: 450px;");
            res.write("    max-width: 90%;");
            res.write("  }");
            res.write("  #heading {");
            res.write("    font-size: 50px;");
            res.write("  }");
            res.write("  h2 {");
            res.write("    font-size: 40px;");
            res.write("  }");
            res.write("  h3 {");
            res.write("    font-size: 30px;");
            res.write("  }");
            res.write("  img {");
            res.write("    max-width: 200px;");
            res.write("    height: auto;");
            res.write("  }");
            res.write("}");
            
            res.write("</style>");
            


            res.write("<center>");
            res.write("<div class='content-box'>");
            res.write("<h2 id='heading'>The Weather of " + currentData.place + " is " + currentData.description + ".</h2>");
            res.write("<h1 id='heading'>The Temperature is " + currentData.temp + " Celsius</h1>");
            res.write("<img src='" + currentData.imageURL + "'/>");
            res.write("<div class='data-box'>");
            res.write("<div class='box'>");
            res.write("<h2>Humidity</h2>");
            res.write("<h3>" + currentData.humidity + "%</h3>");
            res.write("</div>");
            res.write("<div class='box'>");
            res.write("<h2>Rain Percentage</h2>");
            res.write("<h3>" + currentData.rainPercentage + "%</h3>");
            res.write("</div>");
            res.write("<div class='box'>");
            res.write("<h2>Air Quality</h2>");
            res.write("<h3>" + currentData.airQuality + "</h3>");
            res.write("</div>");
            res.write("</div>");
            res.write("</div>");
            res.write("</center>");
            res.end();
        }
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});
