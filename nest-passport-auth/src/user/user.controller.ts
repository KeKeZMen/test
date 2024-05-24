import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResponse } from "./dto";
import { CurrentUser, Roles } from "@share/decorators";
import { IJwtPayload } from "@auth/interfaces";
import { RolesGuard } from "@auth/guards/roles.guards";
import { Role } from "@prisma/client";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":idOrEmail")
  async findUser(@Param("idOrEmail") idOrEmail: string) {
    const user = await this.userService.findOneByIdOrEmail(idOrEmail);
    return new UserResponse(user);
  }

  @Delete(":id")
  async deleteUser(
    @Param("id", ParseUUIDPipe) userId: string,
    @CurrentUser() user: IJwtPayload
  ) {
    return await this.userService.delete(userId, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async me(@CurrentUser() user: IJwtPayload) {
    return await this.userService.findOneByIdOrEmail(user.id ?? user.email);
  }
}
