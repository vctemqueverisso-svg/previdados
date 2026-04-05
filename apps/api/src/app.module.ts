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
import { AttendancesModule } from "./modules/attendances/attendances.module";
import { DeadlinesModule } from "./modules/deadlines/deadlines.module";
import { FinanceModule } from "./modules/finance/finance.module";

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
    AttendancesModule,
    DeadlinesModule,
    FinanceModule,
    DashboardModule,
    TaxonomyModule
  ]
})
export class AppModule {}
