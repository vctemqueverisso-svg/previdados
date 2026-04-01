import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { ExpertsModule } from "./modules/experts/experts.module";
import { CasesModule } from "./modules/cases/cases.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { TaxonomyModule } from "./modules/taxonomy/taxonomy.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ExpertsModule,
    CasesModule,
    DocumentsModule,
    DashboardModule,
    TaxonomyModule
  ]
})
export class AppModule {}

