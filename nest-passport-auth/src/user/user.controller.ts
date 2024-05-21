import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.save(createUserDto);
  }

  @Get(":idOrEmail")
  async findUser(@Param("idOrEmail") idOrEmail: string) {
    return await this.userService.findOneByIdOrEmail(idOrEmail);
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseUUIDPipe) userId: string) {
    return await this.userService.delete(userId);
  }
}
