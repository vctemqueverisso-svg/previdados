import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    const passwordMatches = await argon2.verify(user.passwordHash, password);

    if (!passwordMatches) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    await this.usersService.updateLastLogin(user.id);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: payload
    };
  }
}

