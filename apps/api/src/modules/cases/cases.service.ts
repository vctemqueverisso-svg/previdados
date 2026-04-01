import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { CaseFiltersDto } from "./dto/case-filters.dto";

function toDate(value?: string) {
  return value ? new Date(value) : undefined;
}

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCaseDto, userId: string) {
    return this.prisma.case.create({
      data: {
        internalCode: dto.internalCode,
        clientId: dto.clientId,
        caseNumber: dto.caseNumber,
        channelType: dto.channelType,
        benefitType: dto.benefitType,
        protocolDate: toDate(dto.protocolDate),
        derDate: toDate(dto.derDate),
        expertExamDate: toDate(dto.expertExamDate),
        decisionDate: toDate(dto.decisionDate),
        mainDiseaseId: dto.mainDiseaseId,
        mainCidId: dto.mainCidId,
        profession: dto.profession,
        educationLevel: dto.educationLevel,
        ageAtFiling: dto.ageAtFiling,
        familyIncome: dto.familyIncome,
        familyGroupDescription: dto.familyGroupDescription,
        expertId: dto.expertId,
        courtAgencyName: dto.courtAgencyName,
        courtDivision: dto.courtDivision,
        city: dto.city,
        state: dto.state,
        urgentReliefRequested: dto.urgentReliefRequested ?? false,
        currentStatus: dto.currentStatus,
        strategySummary: dto.strategySummary,
        createdByUserId: userId,
        secondaryDiseases: dto.secondaryDiseaseIds?.length
          ? {
              createMany: {
                data: dto.secondaryDiseaseIds.map((diseaseId) => ({ diseaseId }))
              }
            }
          : undefined,
        secondaryCids: dto.secondaryCidIds?.length
          ? {
              createMany: {
                data: dto.secondaryCidIds.map((cidId) => ({ cidId }))
              }
            }
          : undefined,
        result: dto.result ? { create: dto.result } : undefined,
        internalNotes: dto.internalNote
          ? {
              create: {
                ...dto.internalNote,
                createdByUserId: userId
              }
            }
          : undefined,
        proceduralEvents: dto.proceduralEvents?.length
          ? {
              create: dto.proceduralEvents.map((event) => ({
                eventType: event.eventType,
                eventDate: new Date(event.eventDate),
                description: event.description,
                relatedDocumentId: event.relatedDocumentId,
                createdByUserId: userId
              }))
            }
          : undefined
      },
      include: {
        client: true,
        mainDisease: true,
        mainCid: true,
        result: true,
        expert: true
      }
    });
  }

  findAll(filters: CaseFiltersDto) {
    const where = {
      AND: [
        filters.search
          ? {
              OR: [
                { internalCode: { contains: filters.search, mode: "insensitive" as const } },
                { caseNumber: { contains: filters.search, mode: "insensitive" as const } },
                {
                  client: {
                    fullName: { contains: filters.search, mode: "insensitive" as const }
                  }
                }
              ]
            }
          : {},
        filters.diseaseId
          ? {
              OR: [
                { mainDiseaseId: filters.diseaseId },
                { secondaryDiseases: { some: { diseaseId: filters.diseaseId } } }
              ]
            }
          : {},
        filters.cidId
          ? {
              OR: [
                { mainCidId: filters.cidId },
                { secondaryCids: { some: { cidId: filters.cidId } } }
              ]
            }
          : {},
        filters.expertId ? { expertId: filters.expertId } : {},
        filters.specialty
          ? { expert: { specialty: { contains: filters.specialty, mode: "insensitive" as const } } }
          : {},
        filters.profession
          ? { profession: { contains: filters.profession, mode: "insensitive" as const } }
          : {},
        filters.benefitType ? { benefitType: filters.benefitType } : {},
        filters.channelType ? { channelType: filters.channelType } : {},
        filters.outcome
          ? {
              result: {
                is: {
                  OR: [
                    { finalOutcome: filters.outcome },
                    { administrativeResult: filters.outcome },
                    { judicialResult: filters.outcome }
                  ]
                }
              }
            }
          : {},
        filters.gender ? { client: { gender: filters.gender } } : {},
        filters.city ? { city: { contains: filters.city, mode: "insensitive" as const } } : {},
        filters.dateFrom || filters.dateTo
          ? {
              protocolDate: {
                gte: toDate(filters.dateFrom),
                lte: toDate(filters.dateTo)
              }
            }
          : {}
      ]
    };

    return this.prisma.case.findMany({
      where,
      include: {
        client: true,
        mainDisease: true,
        mainCid: true,
        expert: true,
        result: true,
        internalNotes: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  findOne(id: string) {
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        mainDisease: true,
        mainCid: true,
        secondaryDiseases: { include: { disease: true } },
        secondaryCids: { include: { cid: true } },
        expert: true,
        documents: { include: { category: true, extractions: true }, orderBy: { createdAt: "desc" } },
        proceduralEvents: { orderBy: { eventDate: "asc" } },
        internalNotes: { orderBy: { createdAt: "desc" } },
        result: true
      }
    });
  }

  async update(id: string, dto: UpdateCaseDto, userId: string) {
    if (dto.secondaryDiseaseIds) {
      await this.prisma.caseSecondaryDisease.deleteMany({ where: { caseId: id } });
      if (dto.secondaryDiseaseIds.length) {
        await this.prisma.caseSecondaryDisease.createMany({
          data: dto.secondaryDiseaseIds.map((diseaseId) => ({ caseId: id, diseaseId }))
        });
      }
    }

    if (dto.secondaryCidIds) {
      await this.prisma.caseSecondaryCid.deleteMany({ where: { caseId: id } });
      if (dto.secondaryCidIds.length) {
        await this.prisma.caseSecondaryCid.createMany({
          data: dto.secondaryCidIds.map((cidId) => ({ caseId: id, cidId }))
        });
      }
    }

    return this.prisma.case.update({
      where: { id },
      data: {
        internalCode: dto.internalCode,
        clientId: dto.clientId,
        caseNumber: dto.caseNumber,
        channelType: dto.channelType,
        benefitType: dto.benefitType,
        protocolDate: toDate(dto.protocolDate),
        derDate: toDate(dto.derDate),
        expertExamDate: toDate(dto.expertExamDate),
        decisionDate: toDate(dto.decisionDate),
        mainDiseaseId: dto.mainDiseaseId,
        mainCidId: dto.mainCidId,
        profession: dto.profession,
        educationLevel: dto.educationLevel,
        ageAtFiling: dto.ageAtFiling,
        familyIncome: dto.familyIncome,
        familyGroupDescription: dto.familyGroupDescription,
        expertId: dto.expertId,
        courtAgencyName: dto.courtAgencyName,
        courtDivision: dto.courtDivision,
        city: dto.city,
        state: dto.state,
        urgentReliefRequested: dto.urgentReliefRequested,
        currentStatus: dto.currentStatus,
        strategySummary: dto.strategySummary,
        result: dto.result
          ? {
              upsert: {
                create: dto.result,
                update: dto.result
              }
            }
          : undefined,
        internalNotes: dto.internalNote
          ? {
              create: {
                ...dto.internalNote,
                createdByUserId: userId,
                updatedByUserId: userId
              }
            }
          : undefined
      },
      include: {
        client: true,
        result: true,
        expert: true,
        mainDisease: true
      }
    });
  }

  remove(id: string) {
    return this.prisma.case.delete({ where: { id } });
  }
}
