import { PartialType } from "@nestjs/mapped-types";
import { CreateFinancialControlDto } from "./create-financial-control.dto";

export class UpdateFinancialControlDto extends PartialType(CreateFinancialControlDto) {}
