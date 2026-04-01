import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClientDto, userId: string) {
    return this.prisma.client.create({
      data: {
        ...dto,
        birthDate: new Date(dto.birthDate),
        createdByUserId: userId
      }
    });
  }

  findAll(search?: string) {
    return this.prisma.client.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { cpf: { contains: search } },
              { city: { contains: search, mode: "insensitive" } }
            ]
          }
        : undefined,
      include: {
        cases: {
          select: {
            id: true,
            internalCode: true,
            benefitType: true,
            currentStatus: true
          }
        }
      },
      orderBy: { fullName: "asc" }
    });
  }

  findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        cases: {
          include: {
            result: true,
            expert: true
          },
          orderBy: { createdAt: "desc" }
        },
        documents: {
          include: { category: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  update(id: string, dto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined
      }
    });
  }

  remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}

