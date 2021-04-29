import { Router } from 'express';
import WeatherController from '@controllers/weather.controller';
import Route from '@interfaces/routes.interface';
import { WeatherByCityNameRequestDto } from "@dtos/weatherByCityNameRequest.dto";
import { WeatherByCoordinatesRequestDto } from "@dtos/weatherByCoordinatesRequest.dto";
import { WeatherByIdRequestDto } from "@dtos/weatherByIdRequest.dto";
import validationMiddleware from '@middlewares/validation.middleware';

class WeatherRoute implements Route {
    public path = '/weather';
    public router = Router();
    public weatherController = new WeatherController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/city-name`, validationMiddleware(WeatherByCityNameRequestDto, 'query'), this.weatherController.getWeatherByCityName);
        this.router.get(`${this.path}/coordinates`, validationMiddleware(WeatherByCoordinatesRequestDto, 'query'), this.weatherController.getWeatherByCoordinates);
        this.router.get(`${this.path}/city-id`, validationMiddleware(WeatherByIdRequestDto, 'query'), this.weatherController.getWeatherByCityId);
    }
}

export default WeatherRoute;
