import {
  serializeAmount,
  toAmountMinor,
  toIsoDateTime,
  type RegistryGroupResponse,
  type TontineId,
  type UserId,
  type CycleFrequency,
} from "@mitemo/contracts";
import type { TontineGroup } from "../../../generated/prisma/client.js";
const FREE_POLICY = {
  version: "registry-free-v1",
  mode: "FREE",
  mitemoFee: "0",
  operatorFee: "0",
  responsibleFee: "0",
} as const;
/**
 * Sérialise le groupe gratuit sans exposer les entités Prisma.
 * @param group Groupe persistant.
 * @returns Contrat HTTP du registre.
 */
export function registryGroupResponse(group: TontineGroup): RegistryGroupResponse {
  return {
    id: group.id as TontineId,
    name: group.name,
    ownerId: group.ownerId as UserId,
    participantCount: group.participantCount,
    frequencyUnit: group.frequencyUnit as CycleFrequency["unit"],
    frequencyInterval: group.frequencyInterval,
    state: "RECRUTEMENT",
    mode: "REGISTRY",
    createdAt: toIsoDateTime(group.createdAt.toISOString()),
    contributionAmount: {
      amount: serializeAmount(toAmountMinor(group.contributionAmount)),
      currency: "XAF",
    },
    feePolicy: FREE_POLICY,
  } satisfies RegistryGroupResponse;
}
