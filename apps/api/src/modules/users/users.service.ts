import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  }
}

