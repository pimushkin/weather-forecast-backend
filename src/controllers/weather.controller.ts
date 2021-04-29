import { NextFunction, Request, Response } from 'express';
import { IWeatherApiResponse } from '@interfaces/weatherApiResponse.interface';
import WeatherService from '@services/weather.service';
import { WeatherByCityNameRequestDto } from '@dtos/weatherByCityNameRequest.dto';
import { WeatherByCoordinatesRequestDto } from '@dtos/weatherByCoordinatesRequest.dto';
import { WeatherByIdRequestDto } from '@dtos/weatherByIdRequest.dto';

class WeatherController {
    private weatherService = new WeatherService();

    public getWeatherByCityName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: WeatherByCityNameRequestDto = req.query as unknown as WeatherByCityNameRequestDto;
            const weatherData: IWeatherApiResponse = await this.weatherService.getWeatherJsonByCityNameAsync(request);

            res.status(200).json({ data: weatherData });
        } catch (error) {
            next(error);
        }
    };

    public getWeatherByCityId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: WeatherByIdRequestDto = req.query as unknown as WeatherByIdRequestDto;
            const weatherData: IWeatherApiResponse = await this.weatherService.getWeatherJsonByCityIdAsync(request);

            res.status(200).json({ data: weatherData });
        } catch (error) {
            next(error);
        }
    };

    public getWeatherByCoordinates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: WeatherByCoordinatesRequestDto = req.query as unknown as WeatherByCoordinatesRequestDto;
            const weatherData: IWeatherApiResponse = await this.weatherService.getWeatherJsonByCoordinatesAsync(request);

            res.status(200).json({ data: weatherData });
        } catch (error) {
            next(error);
        }
    };
}

export default WeatherController;
