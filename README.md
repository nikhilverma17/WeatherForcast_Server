# Weather App

This is a simple weather application built with Node.js and Express. It fetches current weather data from the OpenWeatherMap API based on user input and displays it on a web page.

## Features

- Retrieves and displays the current temperature, weather description, humidity, rain percentage, sunrise and sunset times, and air quality index for a specified city.
- Uses randomly selected background images for the web page.
- Provides a responsive design that adjusts to different screen sizes.

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Install the dependencies: `npm install`
3. Set up the required environment variables:
   - Create a `.env` file in the root directory.
   - Get Api from api.txt file
   - Add the following line to the `.env` file: `API_KEY=your-openweathermap-api-key`
   - Replace `your-openweathermap-api-key` with your actual API key obtained from OpenWeatherMap.
4. Start the server: `node index.js`
5. Access the application in your browser at `http://localhost:3000`


## Usage

1. Access the website: [Weather App](https://weather-updated.onrender.com/)
2. Enter a city name in the provided input field.
3. Click the "Get Weather" button to fetch and display the weather information for the specified city.


## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to submit a pull request.
