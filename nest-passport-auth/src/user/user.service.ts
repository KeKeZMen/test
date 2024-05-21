import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { hashSync, genSaltSync } from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);

    return await this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: ["User"],
      },
    });
  }

  async findOneByIdOrEmail(idOrEmail: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
