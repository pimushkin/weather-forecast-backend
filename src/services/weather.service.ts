import HttpException from '@exceptions/HttpException';
import { IWeatherApiResponse } from '@interfaces/weatherApiResponse.interface';
import { WeatherByCityNameRequestDto } from '@dtos/weatherByCityNameRequest.dto';
import { WeatherByIdRequestDto } from '@dtos/weatherByIdRequest.dto';
import { WeatherByCoordinatesRequestDto } from '@dtos/weatherByCoordinatesRequest.dto';
import { DeleteCityRequestDto } from '@dtos/deleteCityRequest.dto';
import { redisRepository } from 'repositories/redis.repository';
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
        let exist = await redisRepository.isCityNameExistsAsync(request.query);
        const ex = new HttpException(400, 'The city has already been added.');
        if (exist) {
            throw ex;
        }
        const response = await fetch(encodeURI(`${this.weatherApiUrl}q=${request.query}`));
        this.checkResponse(response);
        let result: IWeatherApiResponse = await response.json();
        const cityExist = await redisRepository.isCityIdExistsAsync(String(result.id));
        await redisRepository.addCityAsync(request.query, String(result.id));
        if (cityExist) {
            throw ex;
        }
        return result;
    }

    async getWeatherForEachCityAsync(): Promise<IWeatherApiResponse[]> {
        let cityIds = [...new Set(await redisRepository.getCityIdsAsync())];
        const promisesFetch = cityIds.map(id => new Promise<Response>(resolve => {
            const response = fetch(`${this.weatherApiUrl}id=${id}`);
            resolve(response);
        }));

        let responses: Response[] = [];

        await Promise.all(promisesFetch).then(results => {
            results.forEach(response => {
                this.checkResponse(response);
                responses.push(response)
            });
        });

        const jsonPromises = responses.map(response => new Promise<IWeatherApiResponse>(resolve => {
            resolve(response.json());
        }));

        let result: IWeatherApiResponse[] = [];
        return new Promise((resolve) => {
            Promise.all(jsonPromises).then(results => {
                results.forEach(json => {
                    result.push(json)
                });
                resolve(result);
            });
        });
    }

    async getWeatherJsonByCoordinatesAsync(request: WeatherByCoordinatesRequestDto): Promise<IWeatherApiResponse> {
        const response = await fetch(`${this.weatherApiUrl}lat=${request.latitude}&lon=${request.longitude}`);
        this.checkResponse(response);
        return response.json();
    }

    async getDefaultWeatherJsonAsync(): Promise<IWeatherApiResponse> {
        const response = await fetch(`${this.weatherApiUrl}id=498817`);
        this.checkResponse(response);
        return response.json();
    }

    async deleteCityByIdAsync(request: DeleteCityRequestDto): Promise<void> {
        const cityExist = await redisRepository.isCityIdExistsAsync(request.id);
        if (!cityExist) {
            throw new HttpException(400, 'The city has already been deleted.');
        }
        await redisRepository.removeCitiesByIdAsync(request.id);
    }
}

export default WeatherService;