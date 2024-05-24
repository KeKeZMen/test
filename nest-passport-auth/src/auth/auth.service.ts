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

  async login(loginDto: LoginDto, userAgent: string): Promise<Tokens> {
    const user: User = await this.userService
      .findOneByIdOrEmail(loginDto.email, true)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user || !compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    return this.generateTokens(user, userAgent);
  }

  async refreshTokens(refreshToken: string, userAgent: string) {
    const token = await this.prisma.token.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.prisma.token.delete({
      where: {
        token: refreshToken,
      },
    });

    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByIdOrEmail(token.userId, true);
    return this.generateTokens(user, userAgent);
  }

  async deleteRefreshToken(token: string) {
    return await this.prisma.token.delete({
      where: {
        token,
      },
    });
  }

  private async generateTokens(user: User, userAgent: string) {
    const accessToken =
      "Bearer " +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

    const refreshToken = await this.getRefreshToken(user.id, userAgent);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(
    userId: string,
    userAgent: string
  ): Promise<Token> {
    const _token = await this.prisma.token.findFirst({
      where: {
        userId,
        userAgent,
      },
    });

    const token = _token?.token ?? "";

    return await this.prisma.token.upsert({
      where: {
        token,
      },
      update: {
        exp: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
        token: crypto.randomUUID(),
      },
      create: {
        userId,
        exp: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
        token: crypto.randomUUID(),
        userAgent,
      },
    });
  }
}
