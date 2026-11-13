import { Controller, Get, Inject, NotFoundException } from "@nestjs/common";
import type { SupportContactResponse } from "@mitemo/contracts";

import { GetSupportContactUseCase } from "../application/get-support-contact.use-case.js";
import { SupportContactUnavailableError } from "../domain/support-contact-unavailable.error.js";

/** Expose le contact du service client, public : il sert aussi avant la connexion. */
@Controller("support")
export class SupportController {
  /**
   * Reçoit le cas d'usage par injection.
   * @param getContact Lecture du contact configuré.
   */
  constructor(
    @Inject(GetSupportContactUseCase) private readonly getContact: GetSupportContactUseCase,
  ) {}

  /**
   * Donne le numéro du service client et sa durée de vie en cache.
   * @returns Le contrat du contact.
   * @throws {NotFoundException} tant qu'aucun numéro n'est configuré.
   */
  @Get("contact")
  contact(): SupportContactResponse {
    try {
      const { phone, maxAgeSeconds } = this.getContact.execute();
      return { phoneNumber: phone.e164, maxAgeSeconds };
    } catch (error) {
      if (error instanceof SupportContactUnavailableError)
        throw new NotFoundException(error.message);
      throw error;
    }
  }
}
