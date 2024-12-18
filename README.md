# Weather Forecast Web Application

## Overview

This is a modern, responsive weather forecast web application that allows users to:
- View weather forecasts for the current location
- Search for weather information in different cities
- See detailed 3-day weather predictions
- Browse location suggestions

## Features

### 🌦️ Key Functionality
- Real-time weather data fetching
- 3-day weather forecast
- Location search with autocomplete
- Recent locations caching
- Responsive design

### 📊 Weather Information Includes
- Average temperature
- Weather condition
- Precipitation chance
- Wind speed
- Wind direction

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- WeatherAPI.com API
- SweetAlert2 for notifications
- Bootstrap for responsive layout

## Prerequisites

- Modern web browser
- Active internet connection
- WeatherAPI.com API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/n7xx/weather-app.git
```

2. Navigate to the project directory:
```bash
cd weather-app
```

3. Open `index.html` in your preferred web browser

## Configuration

### API Key
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Replace `API_KEY` in the JavaScript file with your personal API key

## Usage

### Search Weather
- Type a city name in the search input
- Press Enter or click the search button
- View 3-day forecast for the selected location

### Features
- Autocomplete suggestions while typing
- Recent location caching
- Responsive design for mobile and desktop

## Project Structure

```
weather-forecast-app/
│
├── index.html        # Main HTML file
├── styles.css        # Styling
├── script.js         # Main JavaScript application
├── images/           # Weather icons and images
└── README.md         # Project documentation
```

## Error Handling

- Graceful error messages for:
  - Invalid locations
  - Network issues
  - API request failures

## Performance Optimizations

- Debounced search suggestions
- Local storage for recent locations
- Minimal API calls

## Browser Compatibility

- Chrome
- Firefox
- Safari
- Edge
- Compatible with modern browsers

## API Usage

- Uses WeatherAPI.com for:
  - Weather forecast data
  - Location suggestions

## Security Considerations

- API key management
- Input sanitization
- Error handling

## Potential Improvements

- [ ] Add geolocation support
- [ ] Implement temperature unit switching
- [ ] Create detailed weather charts
- [ ] Add more comprehensive weather details

## Troubleshooting

- Ensure API key is valid
- Check internet connection
- Clear browser cache if issues persist

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - your.email@example.com

Project Link: https://github.com/n7xx/weather-app
