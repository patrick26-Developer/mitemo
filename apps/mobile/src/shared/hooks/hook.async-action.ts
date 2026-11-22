import { useRef, useState } from "react";
import type { RefObject } from "react";

interface ActionLifecycle {
  readonly locked: RefObject<boolean>;
  readonly start: () => void;
  readonly failed: (error: unknown) => void;
  readonly finish: () => void;
}

async function executeAction(
  operation: () => Promise<void>,
  lifecycle: ActionLifecycle,
): Promise<void> {
  if (lifecycle.locked.current) return;
  lifecycle.locked.current = true;
  lifecycle.start();
  try {
    await operation();
  } catch (error) {
    lifecycle.failed(error);
  } finally {
    lifecycle.locked.current = false;
    lifecycle.finish();
  }
}

/**
 * Sérialise les appuis et traduit les échecs sans promesse rejetée oubliée.
 * @param message Message produit pour une erreur métier ou réseau.
 * @returns L'état de l'action et son déclenchement protégé contre le double appui.
 */
export function useAsyncAction(message: (error: unknown) => string) {
  const locked = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const run = (operation: () => Promise<void>) => {
    void executeAction(operation, {
      locked,
      start: () => {
        setPending(true);
        setError("");
      },
      failed: (failure) => setError(message(failure)),
      finish: () => setPending(false),
    });
  };
  return { pending, error, run };
}
