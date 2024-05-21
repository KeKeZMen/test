import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto";
import { AuthService } from "./auth.service";
import { Tokens } from "./interfaces";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

const REFRESH_TOKEN = "refreshToken";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    if (!user) {
      throw new BadRequestException("Не удалось зарегистрировать пользователя");
    }
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);

    if (!tokens) {
      throw new BadRequestException("Не удалось авторизоваться");
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get("refresh")
  async refresh() {}

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(tokens.refreshToken.exp),
      path: "/",
      secure:
        this.configService.get("NODE_ENV", "development") === "production",
    });

    res.status(HttpStatus.CREATED).json(tokens);
  }
}
