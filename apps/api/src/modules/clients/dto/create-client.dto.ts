import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "../../../common/enums";

export class CreateClientDto {
  @IsString()
  fullName!: string;

  @IsString()
  @Length(11, 14)
  cpf!: string;

  @IsDateString()
  birthDate!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
