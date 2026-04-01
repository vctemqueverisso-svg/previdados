import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CasesService } from "./cases.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { CaseFiltersDto } from "./dto/case-filters.dto";

@UseGuards(JwtAuthGuard)
@Controller("cases")
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  findAll(@Query() filters: CaseFiltersDto) {
    return this.casesService.findAll(filters);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.casesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCaseDto, @CurrentUser() user: { sub: string }) {
    return this.casesService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCaseDto, @CurrentUser() user: { sub: string }) {
    return this.casesService.update(id, dto, user.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.casesService.remove(id);
  }
}

