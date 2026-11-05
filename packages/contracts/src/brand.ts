declare const BRAND: unique symbol;

/**
 * Rend un type primitif nominal : deux marques différentes ne sont pas interchangeables,
 * même si leur valeur sous-jacente est du même type (un `GroupId` n'est pas un `MemberId`).
 * La marque n'existe qu'à la compilation, aucun coût à l'exécution.
 */
export type Brand<Value, Name extends string> = Value & { readonly [BRAND]: Name };
