import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@UseGuards(JwtAuthGuard)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("caseId") caseId?: string,
    @Query("categoryId") categoryId?: string
  ) {
    return this.documentsService.findAll(search, caseId, categoryId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.documentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDocumentDto, @CurrentUser() user: { sub: string }) {
    return this.documentsService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDocumentDto, @CurrentUser() user: { sub: string }) {
    return this.documentsService.update(id, dto, user.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.documentsService.remove(id);
  }
}

