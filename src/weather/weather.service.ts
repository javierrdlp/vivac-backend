import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { WeatherResponseDto } from './dto/weather-response.dto';

@Injectable()
export class WeatherService {
  private readonly API_KEY = process.env.WEATHER_API_KEY;
  private readonly BASE_URL = 'https://api.weatherapi.com/v1';


  // Clima actual  
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherResponseDto> {
    try {
      const url = `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${lat},${lon}&lang=es`;

      const { data } = await axios.get(url);

      return {
        location: data.location.name,
        region: data.location.region,
        country: data.location.country,
        temperature: data.current.temp_c,
        feelsLike: data.current.feelslike_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        windKph: data.current.wind_kph,
        humidity: data.current.humidity,
        precipMm: data.current.precip_mm,
        cloud: data.current.cloud,
        uv: data.current.uv,
        lastUpdated: data.current.last_updated,
      };
    } catch (error) {
      console.error(error.response?.data || error);
      throw new InternalServerErrorException('Error fetching weather data');
    }
  }


  // Prevision por días y horas   
  async getForecast(lat: number, lon: number, days: number = 3) {
    try {
      // Máximo permitido en plan free
      if (days > 3) days = 3;

      const url = `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${lat},${lon}&days=${days}&lang=es`;

      const { data } = await axios.get(url);

      return {
        location: data.location.name,
        region: data.location.region,
        country: data.location.country,

        forecast: data.forecast.forecastday.map((day) => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          avgTemp: day.day.avgtemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          maxWind: day.day.maxwind_kph,
          totalPrecip: day.day.totalprecip_mm,
          uv: day.day.uv,

          hours: day.hour.map((h) => ({
            time: h.time,
            temp: h.temp_c,
            feelsLike: h.feelslike_c,
            condition: h.condition.text,
            icon: h.condition.icon,
            windKph: h.wind_kph,
            humidity: h.humidity,
            precipMm: h.precip_mm,
            chanceOfRain: h.chance_of_rain,
            cloud: h.cloud,
          })),
        })),
      };
    } catch (error) {
      console.error(error.response?.data || error);
      throw new InternalServerErrorException('Error fetching weather forecast');
    }
  }
}

