import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OutcomeStatus } from "../../common/enums";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalCases,
      totalClients,
      totalExperts,
      casesByBenefit,
      casesByDisease,
      casesByExpert,
      casesByChannel,
      successfulCases,
      unsuccessfulCases,
      averageIntervals
    ] = await Promise.all([
      this.prisma.case.count(),
      this.prisma.client.count(),
      this.prisma.expert.count(),
      this.prisma.case.groupBy({
        by: ["benefitType"],
        _count: { _all: true }
      }),
      this.prisma.case.groupBy({
        by: ["mainDiseaseId"],
        _count: { _all: true }
      }),
      this.prisma.case.groupBy({
        by: ["expertId"],
        _count: { _all: true }
      }),
      this.prisma.case.groupBy({
        by: ["channelType"],
        _count: { _all: true }
      }),
      this.prisma.caseResult.count({ where: { successFlag: true } }),
      this.prisma.caseResult.count({ where: { successFlag: false } }),
      this.prisma.case.findMany({
        where: {
          protocolDate: { not: null },
          expertExamDate: { not: null },
          decisionDate: { not: null }
        },
        select: {
          protocolDate: true,
          expertExamDate: true,
          decisionDate: true
        }
      })
    ]);

    const diseaseIds = casesByDisease.map((item: any) => item.mainDiseaseId).filter(Boolean) as string[];
    const expertIds = casesByExpert.map((item: any) => item.expertId).filter(Boolean) as string[];

    const [diseases, experts, proceduralSuccessByDisease] = await Promise.all([
      this.prisma.disease.findMany({ where: { id: { in: diseaseIds } } }),
      this.prisma.expert.findMany({ where: { id: { in: expertIds } } }),
      this.prisma.case.findMany({
        include: { mainDisease: true, result: true }
      })
    ]);

    const averageDaysToExpertise =
      averageIntervals.length === 0
        ? 0
        : Number(
            (
              averageIntervals.reduce((acc: number, item: any) => {
                const diff =
                  (item.expertExamDate!.getTime() - item.protocolDate!.getTime()) / (1000 * 60 * 60 * 24);
                return acc + diff;
              }, 0) / averageIntervals.length
            ).toFixed(1)
          );

    const averageDaysToDecision =
      averageIntervals.length === 0
        ? 0
        : Number(
            (
              averageIntervals.reduce((acc: number, item: any) => {
                const diff =
                  (item.decisionDate!.getTime() - item.protocolDate!.getTime()) / (1000 * 60 * 60 * 24);
                return acc + diff;
              }, 0) / averageIntervals.length
            ).toFixed(1)
          );

    const outcomeByDiseaseMap = proceduralSuccessByDisease.reduce(
      (acc: Record<string, { success: number; failure: number }>, item: any) => {
        const disease = item.mainDisease?.name ?? "Não informada";
        if (!acc[disease]) {
          acc[disease] = { success: 0, failure: 0 };
        }
        if (item.result?.successFlag) {
          acc[disease].success += 1;
        } else if (item.result?.finalOutcome && item.result.finalOutcome !== OutcomeStatus.PENDENTE) {
          acc[disease].failure += 1;
        }
        return acc;
      },
      {}
    ) as Record<string, { success: number; failure: number }>;

    return {
      totals: {
        totalCases,
        totalClients,
        totalExperts,
        successfulCases,
        unsuccessfulCases,
        averageDaysToExpertise,
        averageDaysToDecision
      },
      byBenefit: casesByBenefit.map((item: any) => ({
        label: item.benefitType,
        total: item._count._all
      })),
      byDisease: casesByDisease.map((item: any) => ({
        label: diseases.find((disease: any) => disease.id === item.mainDiseaseId)?.name ?? "Não informada",
        total: item._count._all
      })),
      byExpert: casesByExpert.map((item: any) => ({
        label: experts.find((expert: any) => expert.id === item.expertId)?.fullName ?? "Sem perito",
        total: item._count._all
      })),
      byChannel: casesByChannel.map((item: any) => ({
        label: item.channelType,
        total: item._count._all
      })),
      outcomeByDisease: Object.entries(outcomeByDiseaseMap).map(([label, values]) => ({
        label,
        ...values
      }))
    };
  }
}
