import { IJwtPayload } from "@auth/interfaces";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Role, User } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { convertToSecondsUtil } from "@share/utils";
import { hashSync, genSaltSync } from "bcrypt";
import { Cache } from "cache-manager";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

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

  async findOneByIdOrEmail(idOrEmail: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }

    const user = await this.cacheManager.get<User>(idOrEmail);

    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
      });

      if (!user) {
        return null;
      }

      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get("JWT_EXPIRE"))
      );
    }

    return user;
  }

  async delete(id: string, user: IJwtPayload) {
    if (user.id !== id && !user.roles.includes(Role.Admin)) {
      throw new ForbiddenException();
    }

    await Promise.all([
      this.cacheManager.del(id),
      this.cacheManager.del(user.email),
    ]);

    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
