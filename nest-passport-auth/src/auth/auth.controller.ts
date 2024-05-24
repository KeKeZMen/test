import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto";
import { AuthService } from "./auth.service";
import { Tokens } from "./interfaces";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Cookie, Public, UserAgent } from "@share/decorators";
import { UserResponse } from "@user/dto";

const REFRESH_TOKEN = "refreshToken";

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    if (!user) {
      throw new BadRequestException("Не удалось зарегистрировать пользователя");
    }

    return new UserResponse(user);
  }

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @UserAgent() userAgent: string
  ) {
    const tokens = await this.authService.login(loginDto, userAgent);

    if (!tokens) {
      throw new BadRequestException("Не удалось авторизоваться");
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get("refresh")
  async refresh(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() userAgent: string
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(
      refreshToken,
      userAgent
    );

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get("logout")
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }

    await this.authService.deleteRefreshToken(refreshToken);

    res.cookie(REFRESH_TOKEN, "", {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });

    res.sendStatus(HttpStatus.OK);
  }

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

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
