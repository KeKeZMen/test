import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { resolve, join } from "path";
import { randomUUID } from "crypto";

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = randomUUID() + ".jpg";
      const filePath = resolve(__dirname, "..", "static");
      console.log(filePath);
      
      if (!existsSync(filePath)) {
        mkdir(filePath, { recursive: true });
      }
      writeFile(join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException(
        "Произошла ошибка при записифайла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
