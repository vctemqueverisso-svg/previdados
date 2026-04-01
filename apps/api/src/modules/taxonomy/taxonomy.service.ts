import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TaxonomyService {
  constructor(private readonly prisma: PrismaService) {}

  listDiseases(search?: string) {
    return this.prisma.disease.findMany({
      where: search ? { name: { contains: search, mode: "insensitive" as const } } : undefined,
      orderBy: { name: "asc" }
    });
  }

  listCids(search?: string) {
    return this.prisma.cid.findMany({
      where: search
        ? {
            OR: [
              { code: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : undefined,
      orderBy: { code: "asc" }
    });
  }

  listDocumentCategories() {
    return this.prisma.documentCategory.findMany({
      orderBy: { name: "asc" }
    });
  }
}
