import { redisRepository } from 'repositories/redis.repository';
import HttpException from '@exceptions/HttpException';
import { CityDto } from '@dtos/city.dto';
import { DeleteCityRequestDto } from '@dtos/deleteCityRequest.dto';
import { ExistenceOfCityRequestDto } from '@dtos/existenceOfCityRequest.dto';

class FavoriteService {
    async addCityAsync(city: CityDto): Promise<void> {
        const cityExist = await redisRepository.isCityExistsAsync(city.name, String(city.id));
        if (cityExist) {
            throw new HttpException(400, 'The city has already been added.');
        }
        await redisRepository.addCityAsync(city.name, String(city.id));
    }

    async deleteCityByIdAsync(request: DeleteCityRequestDto): Promise<void> {
        const cityExist = await redisRepository.isCityIdExistsAsync(request.id);
        if (cityExist) {
            throw new HttpException(400, 'The city has already been deleted.');
        }
        await redisRepository.removeCitiesByIdAsync(request.id);
    }

    async isCityNameExistsAsync(request: ExistenceOfCityRequestDto): Promise<boolean> {
        return await redisRepository.isCityNameExistsAsync(request.name);
    }
}

export default FavoriteService;