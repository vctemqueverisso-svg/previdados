import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll(@Query("search") search?: string) {
    return this.clientsService.findAll(search);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClientDto, @CurrentUser() user: { sub: string }) {
    return this.clientsService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.clientsService.remove(id);
  }
}

