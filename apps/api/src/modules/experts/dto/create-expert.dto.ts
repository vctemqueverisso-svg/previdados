import { IsOptional, IsString } from "class-validator";

export class CreateExpertDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  registryNumber?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;
}

