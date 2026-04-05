import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";

function toDate(value?: string) {
  return value ? new Date(value) : undefined;
}

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string, clientId?: string, caseId?: string) {
    return this.prisma.attendance.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { summary: { contains: search, mode: "insensitive" } },
                  { clientReport: { contains: search, mode: "insensitive" } },
                  { legalStrategy: { contains: search, mode: "insensitive" } },
                  { nextSteps: { contains: search, mode: "insensitive" } },
                  { client: { fullName: { contains: search, mode: "insensitive" } } },
                  { case: { internalCode: { contains: search, mode: "insensitive" } } }
                ]
              }
            : {},
          clientId ? { clientId } : {},
          caseId ? { caseId } : {}
        ]
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        },
        case: {
          select: {
            id: true,
            internalCode: true
          }
        }
      },
      orderBy: [{ attendanceDate: "desc" }, { createdAt: "desc" }]
    });
  }

  findOne(id: string) {
    return this.prisma.attendance.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        },
        case: {
          select: {
            id: true,
            internalCode: true
          }
        }
      }
    });
  }

  create(dto: CreateAttendanceDto, userId: string) {
    return this.prisma.attendance.create({
      data: {
        clientId: dto.clientId,
        caseId: dto.caseId || null,
        kind: dto.kind,
        title: dto.title,
        attendanceDate: new Date(dto.attendanceDate),
        contactChannel: dto.contactChannel,
        summary: dto.summary,
        clientReport: dto.clientReport,
        legalStrategy: dto.legalStrategy,
        requestedDocuments: dto.requestedDocuments,
        nextSteps: dto.nextSteps,
        createdByUserId: userId
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        },
        case: {
          select: {
            id: true,
            internalCode: true
          }
        }
      }
    });
  }

  update(id: string, dto: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        caseId: dto.caseId === "" ? null : dto.caseId,
        kind: dto.kind,
        title: dto.title,
        attendanceDate: toDate(dto.attendanceDate),
        contactChannel: dto.contactChannel,
        summary: dto.summary,
        clientReport: dto.clientReport,
        legalStrategy: dto.legalStrategy,
        requestedDocuments: dto.requestedDocuments,
        nextSteps: dto.nextSteps
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        },
        case: {
          select: {
            id: true,
            internalCode: true
          }
        }
      }
    });
  }

  remove(id: string) {
    return this.prisma.attendance.delete({ where: { id } });
  }
}
