import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FilesService } from "src/files/files.service";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService
  ) {}

  async createPost(dto: CreatePostDto, image: any) {
    const fileName = await this.filesService.createFile(image);
    const post = await this.prisma.post.create({
      data: {
        ...dto,
        userId: +dto.userId,
        image: fileName,
      },
    });

    return post;
  }
}
