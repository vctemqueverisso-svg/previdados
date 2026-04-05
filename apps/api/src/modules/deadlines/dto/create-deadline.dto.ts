import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { DeadlineStatus } from "../../../common/enums";

export class CreateDeadlineDto {
  @IsString()
  clientId!: string;

  @IsString()
  title!: string;

  @IsDateString()
  dueDate!: string;

  @IsString()
  responsibleName!: string;

  @IsOptional()
  @IsEnum(DeadlineStatus)
  status?: DeadlineStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
