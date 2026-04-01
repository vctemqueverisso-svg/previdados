import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDocumentDto, userId: string) {
    return this.prisma.document.create({
      data: {
        clientId: dto.clientId,
        caseId: dto.caseId,
        categoryId: dto.categoryId,
        uploadedByUserId: userId,
        fileName: dto.fileName,
        originalFileName: dto.originalFileName,
        mimeType: dto.mimeType,
        storageKey: dto.storageKey,
        fileSize: dto.fileSize,
        documentDate: dto.documentDate ? new Date(dto.documentDate) : undefined,
        origin: dto.origin,
        notes: dto.notes,
        ocrStatus: dto.ocrStatus,
        aiStatus: dto.aiStatus,
        extractions: dto.extraction
          ? {
              create: {
                ...dto.extraction,
                disabilityStartDate: dto.extraction.disabilityStartDate
                  ? new Date(dto.extraction.disabilityStartDate)
                  : undefined
              }
            }
          : undefined
      },
      include: {
        category: true,
        extractions: true,
        case: true,
        client: true
      }
    });
  }

  findAll(search?: string, caseId?: string, categoryId?: string) {
    return this.prisma.document.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { fileName: { contains: search, mode: "insensitive" as const } },
                  { originalFileName: { contains: search, mode: "insensitive" as const } },
                  { notes: { contains: search, mode: "insensitive" as const } }
                ]
              }
            : {},
          caseId ? { caseId } : {},
          categoryId ? { categoryId } : {}
        ]
      },
      include: {
        category: true,
        case: {
          select: { id: true, internalCode: true }
        },
        client: {
          select: { id: true, fullName: true }
        },
        extractions: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: {
        category: true,
        case: true,
        client: true,
        extractions: {
          include: {
            disease: true,
            cid: true
          }
        }
      }
    });
  }

  async update(id: string, dto: UpdateDocumentDto, userId: string) {
    if (dto.extraction) {
      await this.prisma.documentExtraction.deleteMany({
        where: { documentId: id, sourceType: dto.extraction.sourceType }
      });
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        caseId: dto.caseId,
        categoryId: dto.categoryId,
        fileName: dto.fileName,
        originalFileName: dto.originalFileName,
        mimeType: dto.mimeType,
        storageKey: dto.storageKey,
        fileSize: dto.fileSize,
        documentDate: dto.documentDate ? new Date(dto.documentDate) : undefined,
        origin: dto.origin,
        notes: dto.notes,
        ocrStatus: dto.ocrStatus,
        aiStatus: dto.aiStatus,
        extractions: dto.extraction
          ? {
              create: {
                ...dto.extraction,
                reviewedByUserId: userId,
                reviewedAt: new Date(),
                disabilityStartDate: dto.extraction.disabilityStartDate
                  ? new Date(dto.extraction.disabilityStartDate)
                  : undefined
              }
            }
          : undefined
      },
      include: {
        category: true,
        extractions: true
      }
    });
  }

  remove(id: string) {
    return this.prisma.document.delete({ where: { id } });
  }
}
