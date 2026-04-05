import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { AttendanceKind } from "../../../common/enums";

export class UpdateAttendanceDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  caseId?: string;

  @IsOptional()
  @IsEnum(AttendanceKind)
  kind?: AttendanceKind;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  attendanceDate?: string;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  contactChannel?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  clientReport?: string;

  @IsOptional()
  @IsString()
  legalStrategy?: string;

  @IsOptional()
  @IsString()
  requestedDocuments?: string;

  @IsOptional()
  @IsString()
  nextSteps?: string;
}
