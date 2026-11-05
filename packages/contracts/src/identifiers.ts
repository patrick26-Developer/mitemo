import type { Brand } from "./brand.ts";

/** Identifiant d'un groupe de cotisation (UUID v7 attribué par l'API). */
export type GroupId = Brand<string, "GroupId">;

/** Identifiant d'un membre (UUID v7 attribué par l'API). */
export type MemberId = Brand<string, "MemberId">;

/** Identifiant d'une cotisation (UUID v7 attribué par l'API). */
export type ContributionId = Brand<string, "ContributionId">;
