import { apiClient } from "../api/config.api";
import { createSupportApi } from "./api.support-contact";

/** Appels du service client de l'application. */
export const supportApi = createSupportApi(apiClient);
