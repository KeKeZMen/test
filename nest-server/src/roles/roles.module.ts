import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [PrismaModule],
  exports: [RolesService],
})
export class RolesModule {}
