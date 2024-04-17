import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { FilesModule } from "src/files/files.module";

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [PrismaModule, FilesModule],
})
export class PostsModule {}
