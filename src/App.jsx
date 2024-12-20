import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import search from "./assets/search.png";
import clear from "./assets/clear.png";
import cloudy from "./assets/clouds.png";
import rain from "./assets/rain.png";
import snow from "./assets/snowy.png";
import drizzle from "./assets/drizzle.png";
import wind from "./assets/wind.png";
import humidity from "./assets/humidity.png";

const WeatherDetails = ({
  icon,
  country,
  city,
  temp,
  lat,
  lon,
  humidityValue,
  windSpeed,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt={icon} />
      </div>
      <div className="temp">
        <h1>{temp}°C</h1>
      </div>
      <div className="location">
        <h1>{city}</h1>
      </div>
      <div className="country">
        <h1>{country}</h1>
      </div>
      <div className="cord">
        <div>
          <span className="lat">lattitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidityValue}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{windSpeed} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  humidityValue: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
};

function App() {
  const APIkey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [text, setText] = useState("jaffna");
  const [icon, setIcon] = useState(snow);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("jaffna");
  const [humidityValue, setHumidityValue] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clear,
    "01n": clear,
    "02d": cloudy,
    "02n": cloudy,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const searchWeather = async (city) => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${APIkey}&units=Metric`;

    try {
      let response = await fetch(url);
      let data = await response.json();
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setCity(data.name);
      setCountry(data.sys.country);
      setTemp(data.main.temp);
      setHumidityValue(data.main.humidity);
      setWindSpeed(data.wind.speed);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setCityNotFound(false);

      let iconCode = data.weather[0].icon;
      console.log(iconCode);
      setIcon(weatherIconMap[iconCode] || clear);
    } catch (error) {
      console.log(error.message);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchWeather(text);
    }
  };

  useEffect(() => {
    searchWeather(text);
  }, []);
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Search city"
            className="cityInput"
            onChange={handleCity}
            onKeyDown={handleKeyDown}
            value={text}
          />
          <div className="search-icon" onClick={() => searchWeather(text)}>
            <img src={search} alt="search" />
          </div>
        </div>
        {!loading && !cityNotFound && !error && (
          <WeatherDetails
            icon={icon}
            country={country}
            city={city}
            temp={temp}
            humidityValue={humidityValue}
            windSpeed={windSpeed}
            lat={lat}
            lon={lon}
          />
        )}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <p className="copyright">
          Designed by <span> Kajaani</span>
        </p>
      </div>
    </>
  );
}

export default App;
