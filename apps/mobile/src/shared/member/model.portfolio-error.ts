/** Erreur métier d'une opération sur les tontines et les cartes. */
export class PortfolioError extends Error {
  override readonly name: string = "PortfolioError";
}

/** Levée quand le solde disponible ne couvre pas l'opération demandée. */
export class InsufficientFundsError extends PortfolioError {
  override readonly name: string = "InsufficientFundsError";
}

/** Levée quand l'entité demandée n'existe pas ou plus. */
export class UnknownEntityError extends PortfolioError {
  override readonly name: string = "UnknownEntityError";
}

/** Levée quand le membre n'a pas le droit d'effectuer l'opération. */
export class ForbiddenOperationError extends PortfolioError {
  override readonly name: string = "ForbiddenOperationError";
}

/** Levée quand un montant est nul, négatif ou mal formé. */
export class InvalidAmountError extends PortfolioError {
  override readonly name: string = "InvalidAmountError";
}
