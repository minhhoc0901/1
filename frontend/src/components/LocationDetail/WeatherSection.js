import PropTypes from "prop-types";

const WeatherSection = ({ weatherData }) => (
  <section id="weather" className="weather">
    <h2>Thời Tiết Hiện Tại</h2>
    {weatherData ? (
      <div>
        <p>
          <strong>Nhiệt độ:</strong> {weatherData.main.temp}°C
        </p>
        <p>
          <strong>Thời tiết:</strong> {weatherData.weather[0].description}
        </p>
        {weatherData.weather[0].icon && (
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather icon"
          />
        )}
      </div>
    ) : (
      <p>Đang tải dữ liệu thời tiết...</p>
    )}
  </section>
);

WeatherSection.propTypes = {
  weatherData: PropTypes.shape({
    main: PropTypes.shape({
      temp: PropTypes.number,
    }),
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        icon: PropTypes.string,
      })
    ),
  }),
};

export default WeatherSection;
