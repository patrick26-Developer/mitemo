import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DemoAccessGuard, SessionService } from "../../identity/index.js";
import { ExecuteRegistryUseCase } from "../application/execute-registry.use-case.js";
import { RegistryError, type RegistryCommand } from "../domain/registry.repository.js";

const GROUP_REQUEST = {
  schema: {
    type: "object",
    required: ["name", "contributionAmount", "participantCount", "frequency"],
    example: {
      name: "Marché solidaire",
      contributionAmount: { amount: "2000", currency: "XAF" },
      participantCount: 2,
      frequency: { unit: "semaine", interval: 1 },
    },
  },
};

/** Routes du registre gratuit, identifiées séparément des paiements. */
@ApiTags("Registre")
@ApiBearerAuth()
@Controller("registry")
@UseGuards(DemoAccessGuard)
export class RegistryController {
  /**
   * Assemble la session et le cas d'usage.
   * @param sessions Sessions révocables.
   * @param registry Cas d'usage déclaratif.
   */
  constructor(
    @Inject(SessionService) private readonly sessions: SessionService,
    @Inject(ExecuteRegistryUseCase) private readonly registry: ExecuteRegistryUseCase,
  ) {}

  private async run(auth: string | undefined, command: Omit<RegistryCommand, "actorId">) {
    const user = await this.sessions.profile(auth);
    try {
      return await this.registry.execute({ ...command, actorId: user.userId });
    } catch (error) {
      if (error instanceof RegistryError) {
        if (error.inaccessible) throw new NotFoundException(error.message);
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Crée le groupe et la politique gratuite.
   * @param auth Session.
   * @param body Conditions du groupe.
   * @param key Clé UUID de rejeu.
   * @returns Groupe créé.
   */
  @Post("tontines")
  @ApiOperation({ summary: "Créer une tontine Registre gratuite" })
  @ApiHeader({
    name: "Idempotency-Key",
    required: true,
    schema: { type: "string", format: "uuid" },
  })
  @ApiBody(GROUP_REQUEST)
  create(
    @Headers("authorization") auth: string | undefined,
    @Body() body: unknown,
    @Headers("idempotency-key") key: string | undefined,
  ) {
    return this.run(auth, {
      operation: "CREATE",
      body,
      ...(key === undefined ? {} : { idempotencyKey: key }),
    });
  }

  /**
   * Liste les groupes du membre.
   * @param auth Session.
   * @returns Groupes accessibles.
   */
  @Get("tontines")
  list(@Headers("authorization") auth: string | undefined) {
    return this.run(auth, { operation: "LIST" });
  }

  /**
   * Consulte les règles du groupe.
   * @param auth Session.
   * @param id Identifiant du groupe.
   * @returns Groupe et politique.
   */
  @Get("tontines/:id")
  read(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    return this.run(auth, { operation: "READ", resourceId: id });
  }

  /**
   * Liste les membres du groupe.
   * @param auth Session.
   * @param id Groupe.
   * @returns Adhésions.
   */
  @Get("tontines/:id/members")
  members(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    return this.run(auth, { operation: "MEMBERS", resourceId: id });
  }

  /**
   * Invite un compte existant, sous le contrôle de la responsable.
   * @param auth Session.
   * @param id Groupe.
   * @param body Destinataire.
   * @returns Invitation nominative.
   */
  @ApiBody({
    schema: {
      type: "object",
      required: ["userId"],
      properties: { userId: { type: "string", format: "uuid" } },
    },
  })
  @Post("tontines/:id/invitations")
  invite(
    @Headers("authorization") auth: string | undefined,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return this.run(auth, { operation: "INVITE", resourceId: id, body });
  }

  /**
   * Accepte une invitation et la politique gratuite.
   * @param auth Session.
   * @param id Invitation.
   * @param body Version acceptée.
   * @returns Invitation acceptée.
   */
  @ApiBody({
    schema: {
      type: "object",
      required: ["acceptedPolicyVersion"],
      example: { acceptedPolicyVersion: "registry-free-v1" },
    },
  })
  @Post("invitations/:id/accept")
  accept(
    @Headers("authorization") auth: string | undefined,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return this.run(auth, { operation: "ACCEPT", resourceId: id, body });
  }

  /**
   * Refuse une invitation.
   * @param auth Session.
   * @param id Invitation.
   * @returns Invitation refusée.
   */
  @Post("invitations/:id/decline")
  decline(@Headers("authorization") auth: string | undefined, @Param("id") id: string) {
    return this.run(auth, { operation: "DECLINE", resourceId: id });
  }
  /**
   * Modifie le libellé uniquement, sous le contrôle de la responsable.
   * @param auth Session.
   * @param id Groupe.
   * @param body Nouveau nom.
   * @returns Groupe actualisé.
   */
  @Patch("tontines/:id")
  @ApiBody({
    schema: { type: "object", required: ["name"], example: { name: "Marché solidaire" } },
  })
  rename(
    @Headers("authorization") auth: string | undefined,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return this.run(auth, { operation: "RENAME", resourceId: id, body });
  }
  /**
   * Liste les invitations nominatives du compte.
   * @param auth Session.
   * @returns Invitations reçues.
   */
  @Get("invitations")
  invitations(@Headers("authorization") auth: string | undefined) {
    return this.run(auth, { operation: "INVITATIONS" });
  }
}
