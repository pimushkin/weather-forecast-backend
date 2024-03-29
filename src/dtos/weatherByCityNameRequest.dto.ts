import { IsString } from 'class-validator';

export class WeatherByCityNameRequestDto {
    @IsString()
    public cityName: string;
}