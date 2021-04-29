import { Router } from 'express';
import FavoriteController from '@controllers/favorite.controller';
import Route from '@interfaces/routes.interface';
import { CityDto } from "@dtos/city.dto";
import { ExistenceOfCityRequestDto } from "@dtos/existenceOfCityRequest.dto";
import { DeleteCityRequestDto } from "@dtos/deleteCityRequest.dto";
import validationMiddleware from '@middlewares/validation.middleware';

class FavoriteRoute implements Route {
    public path = '/favorite';
    public router = Router();
    public favoriteController = new FavoriteController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/add-city`, validationMiddleware(CityDto, 'body'), this.favoriteController.addCity);
        this.router.get(`${this.path}/check-existence-of-city`, validationMiddleware(ExistenceOfCityRequestDto, 'query'), this.favoriteController.checkExistenceOfCity);
        this.router.delete(`${this.path}/remove-city`, validationMiddleware(DeleteCityRequestDto, 'query'), this.favoriteController.deleteCity);
    }
}

export default FavoriteRoute;