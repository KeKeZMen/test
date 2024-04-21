import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "src/roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const createdUser = await this.prisma.user.create({
      data: dto,
    });

    const role = await this.rolesService.getRoleByValue("USER");

    await this.prisma.roleToUser.create({
      data: {
        userId: createdUser.id,
        roleId: role.id,
      },
    });

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
      select: {
        email: true,
        id: true,
        roleToUser: {
          select: {
            role: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
        id: true,
        password: true,
        roleToUser: {
          select: {
            role: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: dto.userId,
      },
    });

    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      await this.prisma.roleToUser.create({
        data: {
          roleId: role.id,
          userId: user.id,
        },
      });

      return dto;
    }

    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async ban(dto: BanUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: dto.userId,
      },
      data: {
        banned: true,
        banReason: dto.banReason,
      },
    });

    return user;
  }
}
