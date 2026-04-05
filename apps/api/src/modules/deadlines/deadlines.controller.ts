import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { DeadlinesService } from "./deadlines.service";
import { CreateDeadlineDto } from "./dto/create-deadline.dto";
import { UpdateDeadlineDto } from "./dto/update-deadline.dto";

@UseGuards(JwtAuthGuard)
@Controller("deadlines")
export class DeadlinesController {
  constructor(private readonly deadlinesService: DeadlinesService) {}

  @Get()
  findAll(@Query("clientId") clientId?: string) {
    return this.deadlinesService.findAll(clientId);
  }

  @Post()
  create(@Body() dto: CreateDeadlineDto, @CurrentUser() user: { sub: string }) {
    return this.deadlinesService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDeadlineDto) {
    return this.deadlinesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deadlinesService.remove(id);
  }
}
