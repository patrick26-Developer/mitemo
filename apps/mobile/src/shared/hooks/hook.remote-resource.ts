import { useEffect, useState } from "react";

/** Données explicites d'une lecture serveur, sans repli local. */
interface ResourceState<Value> {
  readonly data: Value | null;
  readonly loading: boolean;
  readonly error: string;
}

/** État réseau explicite, sans repli sur des données de démonstration. */
export interface RemoteResource<Value> extends ResourceState<Value> {
  /** Relance une lecture après une erreur ou une écriture. */
  reload(): void;
}

function subscribeResource<Value>(
  load: () => Promise<Value>,
  update: (state: ResourceState<Value>) => void,
): () => void {
  let active = true;
  load().then(
    (data) => {
      if (active) update({ data, loading: false, error: "" });
    },
    () => {
      if (active)
        update({ data: null, loading: false, error: "Connexion indisponible. Réessayez." });
    },
  );
  return () => {
    active = false;
  };
}

/**
 * Ignore les réponses tardives après fermeture ou changement de ressource.
 * @param load Lecture stable de la ressource du compte connecté.
 * @returns Données validées, chargement, erreur et nouvel essai.
 */
export function useRemoteResource<Value>(load: () => Promise<Value>): RemoteResource<Value> {
  const [state, setState] = useState<ResourceState<Value>>({
    data: null,
    loading: true,
    error: "",
  });
  const [version, setVersion] = useState(0);
  useEffect(() => subscribeResource(load, setState), [load, version]);
  const reload = () => {
    setState({ data: null, loading: true, error: "" });
    setVersion((value) => value + 1);
  };
  return { ...state, reload };
}
