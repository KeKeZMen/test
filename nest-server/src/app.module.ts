import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { RolesModule } from "./roles/roles.module";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { PostsModule } from "./posts/posts.module";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "static"),
    }),
    RolesModule,
    AuthModule,
    JwtModule,
    PostsModule,
    FilesModule,
  ],
})
export class AppModule {}
//сурен багдасарян
