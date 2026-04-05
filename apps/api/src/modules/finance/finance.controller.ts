import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateFinancialControlDto } from "./dto/create-financial-control.dto";
import { UpdateFinancialControlDto } from "./dto/update-financial-control.dto";
import { FinanceService } from "./finance.service";

@UseGuards(JwtAuthGuard)
@Controller("finance")
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  findAll(@Query("clientId") clientId?: string) {
    return this.financeService.findAll(clientId);
  }

  @Post()
  create(@Body() dto: CreateFinancialControlDto, @CurrentUser() user: { sub: string }) {
    return this.financeService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFinancialControlDto) {
    return this.financeService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.financeService.remove(id);
  }
}
