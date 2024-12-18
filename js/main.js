// Configuration
const CONFIG = {
  API_KEY: "9528bc878b684723953124920241312",
  API_BASE_URL: "https://api.weatherapi.com/v1",
  DEFAULT_LOCATION: "cairo",
  DEFAULT_DAYS: 3,
};

// Utility Functions
const WeatherUtils = {
  // Wind direction constants
  WIND_DIRECTIONS: [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ],

  // Get random wind direction
  getRandomWindDirection() {
    return this.WIND_DIRECTIONS[
      Math.floor(Math.random() * this.WIND_DIRECTIONS.length)
    ];
  },

  // Format date for weather card
  formatDate(date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      day: days[date.getDay()],
      month: months[date.getMonth()],
      date: date.getDate(),
    };
  },
};

// Weather Service
const WeatherService = {
  // Fetch weather forecast
  async fetchWeatherForecast(location = CONFIG.DEFAULT_LOCATION) {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/forecast.json?key=${CONFIG.API_KEY}&q=${location}&days=${CONFIG.DEFAULT_DAYS}`
      );

      if (!response.ok) {
        throw new Error("Weather data could not be fetched");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching weather:", error);
      throw error;
    }
  },

  // Fetch location suggestions
  async fetchLocationSuggestions(query) {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/search.json?key=${CONFIG.API_KEY}&q=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location suggestions");
      }

      return await response.json();
    } catch (error) {
      console.error("Suggestions error:", error);
      throw error;
    }
  },
};

// Local Storage Service
const LocalStorageService = {
  RECENT_LOCATIONS_KEY: "recentLocations",

  // Save recent locations
  saveRecentLocations(locations, maxItems = 5) {
    try {
      const limitedLocations = locations.slice(0, maxItems);
      localStorage.setItem(
        this.RECENT_LOCATIONS_KEY,
        JSON.stringify(limitedLocations)
      );
    } catch (error) {
      console.error("Error saving recent locations", error);
    }
  },

  // Get recent locations
  getRecentLocations() {
    try {
      const cachedData = localStorage.getItem(this.RECENT_LOCATIONS_KEY);
      return cachedData ? JSON.parse(cachedData) : [];
    } catch (error) {
      console.error("Error parsing cached locations", error);
      return [];
    }
  },
};

// Weather Card Renderer
const WeatherCardRenderer = {
  // Render weather cards
  renderWeatherCards(weatherData) {
    if (!weatherData?.forecast?.forecastday) {
      return "<p>No weather data available</p>";
    }

    return weatherData.forecast.forecastday
      .map((dayForecast, index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + index);

        const formattedDate = WeatherUtils.formatDate(currentDate);

        return `
          <div class="col-xl-4 weather-info rounded-start-1 px-0">
            <div class="card border-0 h-100 rounded-start-1 rounded-end-0">
              <div class="card-header d-flex justify-content-between pt-3 pb-1">
                <h2>${formattedDate.day}</h2>
                <h3>${formattedDate.date} ${formattedDate.month}</h3>
              </div>
              <div class="card-body">
                <h5 class="card-title">${weatherData.location.name}</h5>
                <div class="temperature-info special justify-content-between align-items-center">
                  <h3 class="card-text degree special">${Math.round(
                    dayForecast.day.avgtemp_c
                  )}<small class="position-relative special">o</small>C</h3>
                  <img src="${
                    dayForecast.day.condition.icon
                  }" width="90" class="img-fluid" alt="${
          dayForecast.day.condition.text
        }">
                </div>
                <h4 class="temperature mt-3">${
                  dayForecast.day.condition.text
                }</h4>

                <div class="temperature-imgs d-flex gap-6 justify-content-between w-50 pt-4 pb-2">
                  <div class="img-one d-flex align-items-center gap-2">
                    <img width="20px" src="./images/icon-umberella.png" alt="Precipitation">
                    <p class="mb-0 fs-7">${Math.round(
                      dayForecast.day.daily_chance_of_rain
                    )}%</p>
                  </div>

                  <div class="img-one d-flex align-items-center gap-1">
                    <img width="20px" src="./images/icon-wind.png" alt="Wind Speed">
                    <p class="mb-0 fs-7">${Math.round(
                      dayForecast.day.maxwind_kph
                    )} km/h</p>
                  </div>
                  <div class="img-one d-flex align-items-center gap-2">
                    <img width="20px " src="./images/icon-compass.png" alt="Wind Direction">
                    <p class="mb-0 fs-7">${WeatherUtils.getRandomWindDirection()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  },
};

// Search Component
const WeatherSearch = {
  cachedLocations: [],
  searchTimeout: null,

  // Initialize search functionality
  init() {
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("find");

    this.createSuggestionsContainer(searchInput);
    this.loadCachedLocations();

    searchInput.addEventListener("input", this.debouncedSearch.bind(this));
    searchButton.addEventListener("click", this.performSearch.bind(this));
    searchInput.addEventListener("keypress", this.handleEnterKey.bind(this));
  },

  // Create suggestions container
  createSuggestionsContainer(searchInput) {
    if (!document.getElementById("search-suggestions")) {
      const suggestionsContainer = document.createElement("div");
      suggestionsContainer.id = "search-suggestions";
      suggestionsContainer.className = "search-suggestions";
      searchInput.parentNode.appendChild(suggestionsContainer);
    }
  },

  // Load cached locations from local storage
  loadCachedLocations() {
    this.cachedLocations = LocalStorageService.getRecentLocations();
  },

  // Debounced search
  debouncedSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.showSuggestions(), 300);
  },

  // Handle enter key press
  handleEnterKey(event) {
    if (event.key === "Enter") {
      this.performSearch();
    }
  },

  // Show location suggestions
  async showSuggestions() {
    const searchInput = document.getElementById("search");
    const suggestionsContainer = document.getElementById("search-suggestions");
    const query = searchInput.value.trim();

    if (query.length < 2) {
      this.clearSuggestions(suggestionsContainer);
      return;
    }

    try {
      const suggestions = await WeatherService.fetchLocationSuggestions(query);
      this.renderSuggestions(suggestions, suggestionsContainer, searchInput);
    } catch (error) {
      this.showSuggestionError(suggestionsContainer);
    }
  },

  // Render location suggestions
  renderSuggestions(suggestions, suggestionsContainer, searchInput) {
    if (suggestions.length > 0) {
      suggestionsContainer.innerHTML = suggestions
        .map(
          (location) => `
          <div class="suggestion-item" data-location="${location.name}" data-country="${location.country}">
            ${location.name}, ${location.country}
          </div>
        `
        )
        .join("");

      suggestionsContainer.style.display = "block";

      document.querySelectorAll(".suggestion-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          const location = e.target.getAttribute("data-location");
          searchInput.value = location;
          this.clearSuggestions(suggestionsContainer);
          this.performSearch();
        });
      });
    } else {
      this.clearSuggestions(suggestionsContainer);
    }
  },

  // Clear suggestions container
  clearSuggestions(suggestionsContainer) {
    suggestionsContainer.innerHTML = "";
    suggestionsContainer.style.display = "none";
  },

  // Show suggestion error
  showSuggestionError(suggestionsContainer) {
    suggestionsContainer.innerHTML =
      '<div class="suggestion-error">Unable to fetch suggestions</div>';
    suggestionsContainer.style.display = "block";
  },

  // Perform weather search
  async performSearch() {
    const searchInput = document.getElementById("search");
    const query = searchInput.value.trim();

    if (!query) {
      this.showErrorToast("Please enter a location");
      return;
    }

    this.showLoadingToast(query);

    try {
      const weatherData = await WeatherService.fetchWeatherForecast(query);
      this.handleSuccessfulSearch(weatherData);
    } catch (error) {
      this.handleSearchError(error);
    }
  },

  // Handle successful search
  handleSuccessfulSearch(weatherData) {
    Swal.close();

    const weatherCardsContainer = document.getElementById("showWeatherCards");
    weatherCardsContainer.innerHTML =
      WeatherCardRenderer.renderWeatherCards(weatherData);

    this.cacheLocation(weatherData.location);
    this.clearSuggestions(document.getElementById("search-suggestions"));
  },

  // Handle search error
  handleSearchError(error) {
    this.showErrorToast(error.message || "Unable to fetch weather data");
    document.getElementById("showWeatherCards").innerHTML = "";
  },

  // Cache location
  cacheLocation(location) {
    const exists = this.cachedLocations.some(
      (cached) =>
        cached.name === location.name && cached.country === location.country
    );

    if (!exists) {
      this.cachedLocations.unshift(location);
      LocalStorageService.saveRecentLocations(this.cachedLocations);
    }
  },

  // Show loading toast
  showLoadingToast(query) {
    Swal.fire({
      title: "Searching...",
      text: `Fetching weather data for ${query}`,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  // Show error toast
  showErrorToast(message) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
    });
  },
};

// Main Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initialize search component
  WeatherSearch.init();

  // Fetch initial weather data
  WeatherService.fetchWeatherForecast()
    .then((weatherData) => {
      const weatherCardsContainer = document.getElementById("showWeatherCards");
      weatherCardsContainer.innerHTML =
        WeatherCardRenderer.renderWeatherCards(weatherData);
    })
    .catch((error) => {
      console.error("Initial weather fetch failed:", error);
    });
});
