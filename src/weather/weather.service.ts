import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { WeatherResponseDto } from './dto/weather-response.dto';

@Injectable()
export class WeatherService {
  private readonly API_KEY = process.env.WEATHER_API_KEY;
  private readonly BASE_URL = 'https://api.weatherapi.com/v1';

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
      throw new InternalServerErrorException('Error fetching weather data');
    }
  }
}
