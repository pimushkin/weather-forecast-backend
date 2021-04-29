import { NextFunction, Request, Response } from 'express';
import FavoriteService from '@services/favorite.service';
import { CityDto } from '@dtos/city.dto';
import { DeleteCityRequestDto } from '@dtos/deleteCityRequest.dto';
import { ExistenceOfCityRequestDto } from '@dtos/existenceOfCityRequest.dto';

class FavoriteController {
    private favoriteService = new FavoriteService();

    public addCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: CityDto = req.body;
            await this.favoriteService.addCityAsync(request);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    };

    public deleteCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: DeleteCityRequestDto = req.query as unknown as DeleteCityRequestDto;
            await this.favoriteService.deleteCityByIdAsync(request);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    };

    public checkExistenceOfCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const request: ExistenceOfCityRequestDto = req.query as unknown as ExistenceOfCityRequestDto;
            const result: boolean = await this.favoriteService.isCityNameExistsAsync(request);

            res.status(200).json({ exists: result });
        } catch (error) {
            next(error);
        }
    };
}

export default FavoriteController;