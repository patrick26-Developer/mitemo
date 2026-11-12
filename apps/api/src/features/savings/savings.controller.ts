import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DemoAccessGuard, SessionService } from "../identity/index.js";
import { SavingsService } from "./savings.service.js";

const CREATE_GOAL_BODY = {
  schema: {
    example: {
      name: "Fournitures",
      terms: {
        installmentAmount: { amount: "500", currency: "XAF" },
        frequency: "MONTHLY",
        installmentsPerCycle: 3,
        cycleCount: 1,
        startsAt: "2026-11-30T00:00:00.000Z",
      },
    },
  },
};

/** Exposes individual savings plans and tracking cards. */
@Controller("savings/goals")
@ApiTags("Épargne individuelle")
@ApiBearerAuth()
@ApiResponse({ status: 400, description: "Paramètres invalides" })
@ApiResponse({ status: 401, description: "Authentification requise" })
@ApiResponse({ status: 404, description: "Objectif indisponible" })
@UseGuards(DemoAccessGuard)
export class SavingsController {
  /**
   * Wires dependencies.
   * @param sessions Session authentication.
   * @param savings Savings operations.
   */
  constructor(
    @Inject(SessionService) private readonly sessions: SessionService,
    @Inject(SavingsService) private readonly savings: SavingsService,
  ) {}

  /**
   * Creates an individual savings plan.
   * @param auth Bearer authorization.
   * @param input Untrusted goal terms.
   * @returns Created goal.
   */
  @Post()
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "Créer un objectif sans débiter le portefeuille" })
  @ApiBody(CREATE_GOAL_BODY)
  @ApiResponse({
    status: 201,
    description: "Objectif créé avec goalId, terms, target et createdAt",
  })
  async create(@Headers("authorization") auth: string | undefined, @Body() input: unknown) {
    return this.savings.create((await this.sessions.profile(auth)).userId, input);
  }

  /**
   * Lists the caller's goals.
   * @param auth Bearer authorization.
   * @param cursor Optional pagination cursor.
   * @returns Goal page.
   */
  @Get()
  @Header("Cache-Control", "no-store")
  @ApiQuery({ name: "cursor", required: false, description: "nextCursor de la page précédente" })
  @ApiResponse({ status: 200, description: "Page items et nextCursor facultatif" })
  async list(@Headers("authorization") auth: string | undefined, @Query("cursor") cursor: unknown) {
    return this.savings.list((await this.sessions.profile(auth)).userId, cursor);
  }

  /**
   * Reads one owned goal.
   * @param auth Bearer authorization.
   * @param id Goal UUID.
   * @returns Owned goal.
   */
  @Get(":id")
  @Header("Cache-Control", "no-store")
  @ApiResponse({ status: 200, description: "Objectif appartenant au titulaire de la session" })
  async detail(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    return this.savings.detail((await this.sessions.profile(auth)).userId, id);
  }

  /**
   * Reads the schedule and unpaid tracking state.
   * @param auth Bearer authorization.
   * @param id Goal UUID.
   * @returns Tracking schedule.
   */
  @Get(":id/calendar")
  @Header("Cache-Control", "no-store")
  @ApiResponse({ status: 200, description: "Échéances de la carte de pointage" })
  async calendar(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    return this.savings.calendar((await this.sessions.profile(auth)).userId, id);
  }

  /**
   * Reads confirmed contributions. This lot creates none.
   * @param auth Bearer authorization.
   * @param id Goal UUID.
   * @returns Contribution history.
   */
  @Get(":id/contributions")
  @Header("Cache-Control", "no-store")
  @ApiResponse({ status: 200, description: "Historique vide dans le lot prévisionnel" })
  async contributions(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    return this.savings.contributions((await this.sessions.profile(auth)).userId, id);
  }
}
