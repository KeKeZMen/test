import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "maksimp.09.2004@gmail.com", description: "Почта" })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Неккоректный email" })
  readonly email: string;

  @ApiProperty({ example: "123qwe", description: "Пароль" })
  @IsString({ message: "Должно быть строкой" })
  @Length(4, 16, { message: "Не меньше 4 и не больше 16" })
  readonly password: string;
}
