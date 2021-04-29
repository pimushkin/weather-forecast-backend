import { IsNumber, IsString } from 'class-validator';

export class CityDto {
    @IsString()
    public name: string;

    @IsNumber()
    public id: number;
}