import { IsString } from 'class-validator';

export class ExistenceOfCityRequestDto {
    @IsString()
    public name: string;
}