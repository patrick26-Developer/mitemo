import { useCallback, useState } from "react";
import { useRemoteResource } from "./hook.remote-resource";

/** Page serveur pouvant posséder une suite. */
interface CursorPage {
  readonly nextCursor?: string;
}

/**
 * Parcourt les pages serveur sans tronquer silencieusement l'historique.
 * @param loadPage Lecture authentifiée d'une page.
 * @returns Ressource, relecture de la première page et accès à la suivante.
 */
export function useCursorResource<Page extends CursorPage>(
  loadPage: (cursor?: string) => Promise<Page>,
) {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const load = useCallback(() => loadPage(cursor), [loadPage, cursor]);
  const resource = useRemoteResource(load);
  const nextPage = () => {
    const next = resource.data?.nextCursor;
    if (!next) return;
    resource.reload();
    setCursor(next);
  };
  const reload = () => {
    resource.reload();
    setCursor(undefined);
  };
  return { ...resource, reload, nextPage };
}
