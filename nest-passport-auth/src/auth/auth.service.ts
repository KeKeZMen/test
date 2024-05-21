import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto";
import { UserService } from "@user/user.service";
import { Tokens } from "./interfaces";
import { compareSync } from "bcrypt";
import { Token, User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import {} from "node:crypto";
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async register(registerDto: RegisterDto) {
    const user: User = await this.userService
      .findOneByIdOrEmail(registerDto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (user) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    return await this.userService.save(registerDto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user: User = await this.userService
      .findOneByIdOrEmail(loginDto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user || !compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    const accessToken =
      "Bearer " +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

    const refreshToken = await this.getRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(userId: string): Promise<Token> {
    return await this.prisma.token.create({
      data: {
        userId,
        exp: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
        token: crypto.randomUUID(),
      },
    });
  }
}
