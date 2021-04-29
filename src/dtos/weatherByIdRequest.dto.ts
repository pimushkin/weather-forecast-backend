import { IsNumberString } from 'class-validator';

export class WeatherByIdRequestDto {
    @IsNumberString()
    public cityId: string;
}