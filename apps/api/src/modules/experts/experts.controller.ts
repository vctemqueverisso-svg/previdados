import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ExpertsService } from "./experts.service";
import { CreateExpertDto } from "./dto/create-expert.dto";
import { UpdateExpertDto } from "./dto/update-expert.dto";

@UseGuards(JwtAuthGuard)
@Controller("experts")
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get()
  findAll(@Query("search") search?: string) {
    return this.expertsService.findAll(search);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.expertsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateExpertDto) {
    return this.expertsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateExpertDto) {
    return this.expertsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.expertsService.remove(id);
  }
}

