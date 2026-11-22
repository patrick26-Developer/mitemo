import { Module } from "@nestjs/common";
import { IdentityModule } from "../identity/index.js";
import { PrismaService } from "../../shared/database/prisma.service.js";
import { ExecuteRegistryUseCase } from "./application/execute-registry.use-case.js";
import { PrismaRegistryRepository } from "./infrastructure/prisma-registry.repository.js";
import { RegistryController } from "./presentation/registry.controller.js";

/** Registre déclaratif gratuit et indépendant du portefeuille. */
@Module({
  imports: [IdentityModule],
  controllers: [RegistryController],
  providers: [
    {
      provide: ExecuteRegistryUseCase,
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) =>
        new ExecuteRegistryUseCase(new PrismaRegistryRepository(prisma)),
    },
  ],
})
export class RegistryModule {}
