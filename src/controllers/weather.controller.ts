import { NextFunction, Request, Response } from 'express';
import { IWeatherApiResponse } from '@interfaces/weatherApiResponse.interface';
import WeatherService from '@services/weather.service';
import { WeatherByCityNameRequestDto } from '@dtos/weatherByCityNameRequest.dto';
import { WeatherByCoordinatesRequestDto } from '@dtos/weatherByCoordinatesRequest.dto';
import { DeleteCityRequestDto } from '@dtos/deleteCityRequest.dto';

class WeatherController {
    private weatherService = new WeatherService();

    public getWeatherByCityName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: WeatherByCityNameRequestDto = req.query as unknown as WeatherByCityNameRequestDto;
            const result: IWeatherApiResponse = await this.weatherService.getWeatherJsonByCityNameAsync(request);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public getWeatherForEachCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result: IWeatherApiResponse[] = await this.weatherService.getWeatherForEachCityAsync();

            res.status(200).json({ weatherConditions: result });
        } catch (error) {
            next(error);
        }
    };

    public getWeatherByCoordinates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: WeatherByCoordinatesRequestDto = req.query as unknown as WeatherByCoordinatesRequestDto;
            const result: IWeatherApiResponse = await this.weatherService.getWeatherJsonByCoordinatesAsync(request);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public getDefaultWeather = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result: IWeatherApiResponse = await this.weatherService.getDefaultWeatherJsonAsync();

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public deleteCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: DeleteCityRequestDto = req.body as unknown as DeleteCityRequestDto;
            await this.weatherService.deleteCityByIdAsync(request);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    };
}

export default WeatherController;