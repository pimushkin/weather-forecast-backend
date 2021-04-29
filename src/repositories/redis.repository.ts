import Redis from 'ioredis';

class RedisRepository {
    private redis = new Redis(process.env.REDIS_URL);

    private async getCityNamesAsync(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                const stream = this.redis.scanStream();

                const cityNames: string[] = [];
                stream.on('data', function (resultKeys: string[]) {
                    for (let i = 0; i < resultKeys.length; i++) {
                        cityNames.push(resultKeys[i]);
                    }
                });
                stream.on('end', function () {
                    resolve(cityNames);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    private async getCitiesAsync() : Promise<City[]> {
        let cityNames = await this.getCityNamesAsync();
        if (!cityNames?.length) {
            const cities: City[] = [];
            return cities;
        }

        let promises = cityNames.map(cityName => new Promise<City>(resolve => {
            this.redis.get(cityName, (err, cityId) => {
                let city: City = { name: cityName, id: cityId };
                resolve(city);
            });
        }));

        return Promise.all(promises);
    }

    // async getCityIdsAsync(): Promise<string[]> {
    //     let cityNames = await this.getCityNamesAsync();
    //     if (!cityNames?.length) {
    //         return [];
    //     }
    //     let cityIDs: string[] = [];
    //     let promises = cityNames.map(cityName => new Promise<string>(resolve => {
    //         this.redis.get(cityName, (err, cityId) => {
    //             resolve(cityId);
    //         });
    //     }));
    //     return new Promise((resolve) => {
    //         Promise.all(promises).then(results => {
    //             results.forEach((city: string) => {
    //                 cityIDs.push(city);
    //             });
    //             resolve(cityIDs);
    //         });
    //     });
    // }

    async removeCitiesByIdAsync(cityId : string) : Promise<void> {
        const cities = await this.getCitiesAsync();
        if (cities) {
            cities.filter(function (city : City) {
                return city.id === cityId;
            }).forEach((city: City) => {
                this.redis.del(city.name);
            });
        }
    }

    async addCityAsync(cityName: string, cityId: string): Promise<void> {
        this.redis.set(cityName, cityId);
    };

    async isCityExistsAsync(cityName: string, cityId: string): Promise<boolean> {
        var existingCities = await this.getCitiesAsync();
        if (!existingCities) existingCities = [];
        if (existingCities.filter(function (existingCity: City) {
            return existingCity.name === cityName && existingCity.id === cityId;
        }).length > 0) {
            return true;
        };
        return false;
    }

    async isCityNameExistsAsync(cityName: string): Promise<boolean> {
        var existingCities = await this.getCitiesAsync();
        if (!existingCities) existingCities = [];
        if (existingCities.filter(function (existingCity: City) {
            return existingCity.name === cityName;
        }).length > 0) {
            return true;
        };
        return false;
    }

    async isCityIdExistsAsync(cityId: string): Promise<boolean> {
        var existingCities = await this.getCitiesAsync();
        if (!existingCities) existingCities = [];
        if (existingCities.filter(function (existingCity: City) {
            return existingCity.id === cityId;
        }).length > 0) {
            return false;
        };
        return true;
    }
}

export const redisRepository = new RedisRepository();