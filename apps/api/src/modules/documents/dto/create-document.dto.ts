import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import {
  AIStatus,
  ExtractionSourceType,
  IncapacityDuration,
  IncapacityScope,
  OCRStatus
} from "../../../common/enums";

class CreateExtractionDto {
  @IsEnum(ExtractionSourceType)
  sourceType!: ExtractionSourceType;

  @IsOptional()
  @IsString()
  diseaseId?: string;

  @IsOptional()
  @IsString()
  cidId?: string;

  @IsOptional()
  @IsString()
  medicalConclusion?: string;

  @IsOptional()
  @IsBoolean()
  hasIncapacity?: boolean;

  @IsOptional()
  @IsEnum(IncapacityScope)
  incapacityScope?: IncapacityScope;

  @IsOptional()
  @IsEnum(IncapacityDuration)
  incapacityDuration?: IncapacityDuration;

  @IsOptional()
  @IsDateString()
  disabilityStartDate?: string;

  @IsOptional()
  @IsString()
  functionalLimitations?: string;

  @IsOptional()
  @IsString()
  analyzedProfession?: string;

  @IsOptional()
  @IsBoolean()
  rehabilitationPossible?: boolean;

  @IsOptional()
  @IsString()
  decisionGrounding?: string;

  @IsOptional()
  @IsString()
  finalConclusion?: string;

  @IsOptional()
  @IsNumber()
  confidenceScore?: number;
}

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  caseId?: string;

  @IsString()
  categoryId!: string;

  @IsString()
  fileName!: string;

  @IsString()
  originalFileName!: string;

  @IsString()
  mimeType!: string;

  @IsString()
  storageKey!: string;

  @IsNumber()
  fileSize!: number;

  @IsOptional()
  @IsDateString()
  documentDate?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(OCRStatus)
  ocrStatus?: OCRStatus;

  @IsOptional()
  @IsEnum(AIStatus)
  aiStatus?: AIStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateExtractionDto)
  extraction?: CreateExtractionDto;
}
