import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { createHash } from "crypto";

interface IUserWithRoles {
  roles: Array<{ value: string; id: number }>;
  id: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const hashedPassword = createHash("sha256")
      .update(userDto.password)
      .digest("hex");

    const user = await this.usersService.createUser({
      ...userDto,
      password: hashedPassword,
    });

    return this.generateToken({
      id: user.id,
      email: user.email,
      roles: user.roleToUser.map((role) => ({
        value: role.role.value,
        id: role.role.id,
      })),
    });
  }

  private async generateToken(user: IUserWithRoles) {
    const payload = { email: user.email, id: user.id, roles: user.roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(userDto.email);
    const passwordEquel =
      user.password ==
      createHash("sha256").update(userDto.password).digest("hex");

    if (user && passwordEquel) {
      return {
        id: user.id,
        email: user.email,
        roles: user.roleToUser.map((role) => ({
          value: role.role.value,
          id: role.role.id,
        })),
      };
    }

    throw new UnauthorizedException({
      message: "Некорректный email или пароль",
    });
  }
}
