import { IsNumberString } from 'class-validator';

export class WeatherByCoordinatesRequestDto {
    @IsNumberString()
    public longitude: string;

    @IsNumberString()
    public latitude: string;
}