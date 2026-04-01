import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateExpertDto } from "./dto/create-expert.dto";
import { UpdateExpertDto } from "./dto/update-expert.dto";

@Injectable()
export class ExpertsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateExpertDto) {
    return this.prisma.expert.create({ data: dto });
  }

  findAll(search?: string) {
    return this.prisma.expert.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { specialty: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : undefined,
      include: {
        _count: { select: { cases: true } }
      },
      orderBy: { fullName: "asc" }
    });
  }

  async findOne(id: string) {
    const expert = await this.prisma.expert.findUnique({
      where: { id },
      include: {
        cases: {
          include: {
            result: true,
            mainDisease: true
          }
        }
      }
    });

    if (!expert) {
      return null;
    }

    const favorable = expert.cases.filter((item: any) => item.result?.successFlag).length;
    const diseaseFrequency = expert.cases.reduce((acc: Record<string, number>, item: any) => {
      const key = item.mainDisease?.name ?? "Nao informada";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      ...expert,
      analytics: {
        totalCases: expert.cases.length,
        favorableCases: favorable,
        unfavorableCases: expert.cases.length - favorable,
        successRate: expert.cases.length ? Number(((favorable / expert.cases.length) * 100).toFixed(2)) : 0,
        diseases: Object.entries(diseaseFrequency)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => Number(b.total) - Number(a.total))
      }
    };
  }

  update(id: string, dto: UpdateExpertDto) {
    return this.prisma.expert.update({
      where: { id },
      data: dto
    });
  }

  remove(id: string) {
    return this.prisma.expert.delete({ where: { id } });
  }
}
