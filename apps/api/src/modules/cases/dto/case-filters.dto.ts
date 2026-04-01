import { IsEnum, IsOptional, IsString } from "class-validator";
import { BenefitType, ChannelType, Gender, OutcomeStatus } from "../../../common/enums";

export class CaseFiltersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  diseaseId?: string;

  @IsOptional()
  @IsString()
  cidId?: string;

  @IsOptional()
  @IsString()
  expertId?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsEnum(BenefitType)
  benefitType?: BenefitType;

  @IsOptional()
  @IsEnum(ChannelType)
  channelType?: ChannelType;

  @IsOptional()
  @IsEnum(OutcomeStatus)
  outcome?: OutcomeStatus;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}
