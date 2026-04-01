import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { TaxonomyService } from "./taxonomy.service";

@UseGuards(JwtAuthGuard)
@Controller("taxonomy")
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get("diseases")
  listDiseases(@Query("search") search?: string) {
    return this.taxonomyService.listDiseases(search);
  }

  @Get("cids")
  listCids(@Query("search") search?: string) {
    return this.taxonomyService.listCids(search);
  }

  @Get("document-categories")
  listCategories() {
    return this.taxonomyService.listDocumentCategories();
  }
}

