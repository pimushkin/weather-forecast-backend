import { Router } from 'express';
import WeatherController from '@controllers/weather.controller';
import Route from '@interfaces/routes.interface';
import { WeatherByCityNameRequestDto } from "@dtos/weatherByCityNameRequest.dto";
import { WeatherByCoordinatesRequestDto } from "@dtos/weatherByCoordinatesRequest.dto";
import { DeleteCityRequestDto } from "@dtos/deleteCityRequest.dto";
import validationMiddleware from '@middlewares/validation.middleware';

class WeatherRoute implements Route {
    public path = '/weather';
    public router = Router();
    public weatherController = new WeatherController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/city-by-name`, validationMiddleware(WeatherByCityNameRequestDto, 'query'), this.weatherController.getWeatherByCityName);
        this.router.get(`${this.path}/coordinates`, validationMiddleware(WeatherByCoordinatesRequestDto, 'query'), this.weatherController.getWeatherByCoordinates);
        this.router.get(`${this.path}/all`, this.weatherController.getWeatherForEachCity);
        this.router.get(`${this.path}/default`, this.weatherController.getDefaultWeather);
        this.router.delete(`${this.path}`, validationMiddleware(DeleteCityRequestDto, 'body'), this.weatherController.deleteCity);
    }
}

export default WeatherRoute;
