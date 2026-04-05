import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AttendancesService } from "./attendances.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";

@UseGuards(JwtAuthGuard)
@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("clientId") clientId?: string,
    @Query("caseId") caseId?: string
  ) {
    return this.attendancesService.findAll(search, clientId, caseId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.attendancesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAttendanceDto, @CurrentUser() user: { sub: string }) {
    return this.attendancesService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendancesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.attendancesService.remove(id);
  }
}
