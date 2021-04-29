import HttpException from '@exceptions/HttpException';
import { IWeatherApiResponse } from '@interfaces/weatherApiResponse.interface';
import { WeatherByCityNameRequestDto } from '@dtos/weatherByCityNameRequest.dto';
import { WeatherByIdRequestDto } from '@dtos/weatherByIdRequest.dto';
import { WeatherByCoordinatesRequestDto } from '@dtos/weatherByCoordinatesRequest.dto';
import fetch, { Response } from 'node-fetch';

class WeatherService {
    private weatherApiUrl = `${process.env.BASE_WEATHER_API_URL}weather?units=metric&appid=${process.env.WEATHER_API_KEY}&`;

    private checkResponse(response: Response): void {
        if (response.status >= 200 && response.status < 300) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return;
            }
            throw new HttpException(500, 'Invalid response from the server.');
        } else {
            throw new HttpException(404, 'No data was found for this city.');
        }
    }

    async getWeatherJsonByCityNameAsync(request: WeatherByCityNameRequestDto): Promise<IWeatherApiResponse> {
        const response = await fetch(`${this.weatherApiUrl}q=${request.cityName}`);
        this.checkResponse(response);
        return response.json();
    }

    async getWeatherJsonByCityIdAsync(request: WeatherByIdRequestDto): Promise<IWeatherApiResponse> {
        const response = await fetch(`${this.weatherApiUrl}id=${request.cityId}`);
        this.checkResponse(response);
        return response.json();
    }

    async getWeatherJsonByCoordinatesAsync(request: WeatherByCoordinatesRequestDto): Promise<IWeatherApiResponse> {
        const response = await fetch(`${this.weatherApiUrl}lat=${request.latitude}&lon=${request.longitude}`);
        this.checkResponse(response);
        return response.json();
    }
}

export default WeatherService;