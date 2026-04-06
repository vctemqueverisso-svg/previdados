import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import {
  BenefitType,
  CaseStatus,
  ChannelType,
  OutcomeStatus,
  ProceduralEventType,
  RiskLevel,
  StrengthLevel
} from "../../../common/enums";

class CreateCaseResultDto {
  @IsOptional()
  @IsEnum(OutcomeStatus)
  administrativeResult?: OutcomeStatus;

  @IsOptional()
  @IsEnum(OutcomeStatus)
  judicialResult?: OutcomeStatus;

  @IsOptional()
  @IsEnum(OutcomeStatus)
  finalOutcome?: OutcomeStatus;

  @IsOptional()
  @IsString()
  outcomeReason?: string;

  @IsOptional()
  @IsString()
  decisionSummary?: string;

  @IsOptional()
  @IsBoolean()
  successFlag?: boolean;
}

class CreateInternalNoteDto {
  @IsOptional()
  @IsEnum(StrengthLevel)
  strengthOfMedicalEvidence?: StrengthLevel;

  @IsOptional()
  @IsString()
  mainObstacle?: string;

  @IsOptional()
  @IsString()
  mainThesis?: string;

  @IsOptional()
  @IsString()
  secondaryThesis?: string;

  @IsOptional()
  @IsString()
  hearingExamNotes?: string;

  @IsOptional()
  @IsEnum(RiskLevel)
  estimatedRisk?: RiskLevel;

  @IsOptional()
  @IsString()
  reasonForDenial?: string;

  @IsOptional()
  @IsString()
  decisionCentralGround?: string;

  @IsOptional()
  @IsString()
  privateNote?: string;
}

class CreateProceduralEventDto {
  @IsEnum(ProceduralEventType)
  eventType!: ProceduralEventType;

  @IsDateString()
  eventDate!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  relatedDocumentId?: string;
}

export class CreateCaseDto {
  @IsString()
  internalCode!: string;

  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  caseNumber?: string;

  @IsEnum(ChannelType)
  channelType!: ChannelType;

  @IsEnum(BenefitType)
  benefitType!: BenefitType;

  @IsOptional()
  @IsDateString()
  protocolDate?: string;

  @IsOptional()
  @IsDateString()
  derDate?: string;

  @IsOptional()
  @IsDateString()
  expertExamDate?: string;

  @IsOptional()
  @IsDateString()
  decisionDate?: string;

  @IsOptional()
  @IsString()
  mainDiseaseId?: string;

  @IsOptional()
  @IsString()
  mainCidId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryDiseaseIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryCidIds?: string[];

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsNumber()
  ageAtFiling?: number;

  @IsOptional()
  @IsNumber()
  familyIncome?: number;

  @IsOptional()
  @IsString()
  familyGroupDescription?: string;

  @IsOptional()
  @IsString()
  expertId?: string;

  @IsOptional()
  @IsString()
  expertName?: string;

  @IsOptional()
  @IsString()
  expertRegistryNumber?: string;

  @IsOptional()
  @IsString()
  courtAgencyName?: string;

  @IsOptional()
  @IsString()
  courtDivision?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsBoolean()
  urgentReliefRequested?: boolean;

  @IsOptional()
  @IsEnum(CaseStatus)
  currentStatus?: CaseStatus;

  @IsOptional()
  @IsString()
  strategySummary?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCaseResultDto)
  result?: CreateCaseResultDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateInternalNoteDto)
  internalNote?: CreateInternalNoteDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProceduralEventDto)
  proceduralEvents?: CreateProceduralEventDto[];
}
