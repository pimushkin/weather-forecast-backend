import { IsNumberString } from 'class-validator';

export class DeleteCityRequestDto {
    @IsNumberString()
    public id: string;
}