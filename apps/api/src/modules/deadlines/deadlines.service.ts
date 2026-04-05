import { Injectable } from "@nestjs/common";
import { DeadlineStatus } from "../../common/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDeadlineDto } from "./dto/create-deadline.dto";
import { UpdateDeadlineDto } from "./dto/update-deadline.dto";

function toDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function resolveCompletedAt(status?: DeadlineStatus) {
  return status === DeadlineStatus.CUMPRIDO ? new Date() : null;
}

@Injectable()
export class DeadlinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(clientId?: string) {
    return this.prisma.deadline.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }]
    });
  }

  create(dto: CreateDeadlineDto, userId: string) {
    return this.prisma.deadline.create({
      data: {
        clientId: dto.clientId,
        title: dto.title,
        dueDate: new Date(dto.dueDate),
        responsibleName: dto.responsibleName,
        status: dto.status ?? DeadlineStatus.PENDENTE,
        notes: dto.notes,
        completedAt: dto.status ? resolveCompletedAt(dto.status) : null,
        createdByUserId: userId
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  update(id: string, dto: UpdateDeadlineDto) {
    return this.prisma.deadline.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        title: dto.title,
        dueDate: toDate(dto.dueDate),
        responsibleName: dto.responsibleName,
        status: dto.status,
        notes: dto.notes,
        completedAt:
          dto.status === undefined
            ? undefined
            : dto.status === DeadlineStatus.CUMPRIDO
              ? new Date()
              : null
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  remove(id: string) {
    return this.prisma.deadline.delete({ where: { id } });
  }
}
