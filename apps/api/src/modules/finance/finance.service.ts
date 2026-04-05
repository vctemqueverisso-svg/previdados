import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFinancialControlDto } from "./dto/create-financial-control.dto";
import { UpdateFinancialControlDto } from "./dto/update-financial-control.dto";

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function resolvePlannedInstallments(
  benefitType: string,
  channelType: string,
  projectedBenefitMonths?: number,
  plannedInstallments?: number
) {
  if (plannedInstallments && plannedInstallments > 0) {
    return plannedInstallments;
  }

  if (benefitType === "AUXILIO_DOENCA") {
    return projectedBenefitMonths ?? 0;
  }

  if (benefitType === "BPC_LOAS" || benefitType === "APOSENTADORIA_INCAPACIDADE") {
    return channelType === "JUDICIAL" ? 24 : 12;
  }

  return channelType === "JUDICIAL" ? 24 : 12;
}

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(clientId?: string) {
    return this.prisma.financialControl.findMany({
      where: clientId ? { case: { clientId } } : undefined,
      include: {
        case: {
          select: {
            id: true,
            internalCode: true,
            caseNumber: true,
            channelType: true,
            benefitType: true,
            client: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });
  }

  async create(dto: CreateFinancialControlDto, userId: string) {
    const linkedCase = await this.prisma.case.findUnique({
      where: { id: dto.caseId },
      select: {
        id: true,
        benefitType: true,
        channelType: true
      }
    });

    if (!linkedCase) {
      throw new BadRequestException("Caso nao encontrado para controle financeiro.");
    }

    const minimumWageAmount = dto.minimumWageAmount ?? 1621;
    const installmentPercentage = dto.installmentPercentage ?? 30;
    const installmentValue = roundCurrency((minimumWageAmount * installmentPercentage) / 100);
    const plannedInstallments = resolvePlannedInstallments(
      linkedCase.benefitType,
      linkedCase.channelType,
      dto.projectedBenefitMonths,
      dto.plannedInstallments
    );
    const arrearsPercentage = dto.arrearsPercentage ?? 30;
    const arrearsFeeValue =
      dto.arrearsAmount === undefined ? undefined : roundCurrency((dto.arrearsAmount * arrearsPercentage) / 100);

    return this.prisma.financialControl.upsert({
      where: { caseId: dto.caseId },
      create: {
        caseId: dto.caseId,
        minimumWageAmount,
        installmentPercentage,
        projectedBenefitMonths: dto.projectedBenefitMonths,
        plannedInstallments,
        paidInstallments: dto.paidInstallments ?? 0,
        installmentValue,
        arrearsAmount: dto.arrearsAmount,
        arrearsPercentage,
        arrearsFeeValue,
        arrearsFeePaidAmount: dto.arrearsFeePaidAmount,
        notes: dto.notes,
        createdByUserId: userId
      },
      update: {
        minimumWageAmount,
        installmentPercentage,
        projectedBenefitMonths: dto.projectedBenefitMonths,
        plannedInstallments,
        paidInstallments: dto.paidInstallments ?? 0,
        installmentValue,
        arrearsAmount: dto.arrearsAmount,
        arrearsPercentage,
        arrearsFeeValue,
        arrearsFeePaidAmount: dto.arrearsFeePaidAmount,
        notes: dto.notes
      },
      include: {
        case: {
          select: {
            id: true,
            internalCode: true,
            caseNumber: true,
            channelType: true,
            benefitType: true,
            client: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }
      }
    });
  }

  async update(id: string, dto: UpdateFinancialControlDto) {
    const current = await this.prisma.financialControl.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            benefitType: true,
            channelType: true
          }
        }
      }
    });

    if (!current) {
      throw new BadRequestException("Controle financeiro nao encontrado.");
    }

    const minimumWageAmount = dto.minimumWageAmount ?? Number(current.minimumWageAmount);
    const installmentPercentage = dto.installmentPercentage ?? Number(current.installmentPercentage);
    const installmentValue = roundCurrency((minimumWageAmount * installmentPercentage) / 100);
    const projectedBenefitMonths =
      dto.projectedBenefitMonths === undefined ? current.projectedBenefitMonths ?? undefined : dto.projectedBenefitMonths;
    const plannedInstallments = resolvePlannedInstallments(
      current.case.benefitType,
      current.case.channelType,
      projectedBenefitMonths,
      dto.plannedInstallments ?? current.plannedInstallments
    );
    const arrearsAmount = dto.arrearsAmount === undefined ? Number(current.arrearsAmount ?? 0) || undefined : dto.arrearsAmount;
    const arrearsPercentage = dto.arrearsPercentage ?? Number(current.arrearsPercentage);
    const arrearsFeeValue = arrearsAmount === undefined ? undefined : roundCurrency((arrearsAmount * arrearsPercentage) / 100);

    return this.prisma.financialControl.update({
      where: { id },
      data: {
        minimumWageAmount,
        installmentPercentage,
        projectedBenefitMonths,
        plannedInstallments,
        paidInstallments: dto.paidInstallments ?? current.paidInstallments,
        installmentValue,
        arrearsAmount,
        arrearsPercentage,
        arrearsFeeValue,
        arrearsFeePaidAmount:
          dto.arrearsFeePaidAmount === undefined
            ? current.arrearsFeePaidAmount
            : dto.arrearsFeePaidAmount,
        notes: dto.notes ?? current.notes
      },
      include: {
        case: {
          select: {
            id: true,
            internalCode: true,
            caseNumber: true,
            channelType: true,
            benefitType: true,
            client: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }
      }
    });
  }

  remove(id: string) {
    return this.prisma.financialControl.delete({ where: { id } });
  }
}
