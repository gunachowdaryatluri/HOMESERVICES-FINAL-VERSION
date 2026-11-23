import React from "react";
import { useGetWeatherQuery } from "../app/api.js";

// Weather forecast for the chosen city and date (third-party Open-Meteo API, called through our server)
export default function Weather({ city, date }) {
  const { data, error, isFetching } = useGetWeatherQuery({ city, date }, { skip: city.trim().length < 2 || !date });
  if (city.trim().length < 2 || !date) return null;
  if (isFetching) return <p className="weather">Checking the weather...</p>;
  if (error) return <p className="weather">{error.message}</p>;
  return (
    <p className="weather">
      <b>{data.city}{data.country && ", " + data.country} on {data.date}:</b> {data.summary}, {data.tempMin}° to {data.tempMax}°C, rain chance {data.rainChance}%. {data.advice}
    </p>
  );
}
