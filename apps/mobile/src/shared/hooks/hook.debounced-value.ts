import { useEffect, useState } from "react";

/**
 * Retarde la propagation d'une valeur, le temps que la saisie se stabilise.
 * @template Value Type de la valeur observée.
 * @param value Valeur courante.
 * @param delay Délai d'attente, en millisecondes.
 * @returns La dernière valeur stabilisée.
 */
export function useDebouncedValue<Value>(value: Value, delay: number): Value {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
