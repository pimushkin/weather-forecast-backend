import { IsNumberString } from 'class-validator';

export class WeatherByIdRequestDto {
    @IsNumberString()
    public query: string;
}