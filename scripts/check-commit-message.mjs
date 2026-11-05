/**
 * Refuse les messages de commit qui attribuent le travail à un assistant d'IA.
 * Utilisé par le hook commit-msg et par la CI sur chaque commit d'une pull request.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const AI_EMAIL = /<[^>]*(anthropic|openai|copilot|cursor|codeium|tabnine|devin|gemini)[^>]*>/i;
const AI_NAME = /^co-authored-by:\s*(claude|copilot|chatgpt|gemini|cursor|devin)\s*</i;
const AI_TOOL = /claude|chatgpt|copilot|gemini|cursor|codeium|tabnine|devin/i;
const CO_AUTHOR = /^co-authored-by:/i;
const GENERATED_WITH = /generated (with|by)/i;

/**
 * Indique si la ligne est un commentaire ajouté par Git dans l'éditeur de commit.
 * @param {string} line Ligne du message.
 * @returns {boolean} Vrai si la ligne commence par « # ».
 */
function isGitComment(line) {
  return line.trimStart().startsWith("#");
}

/**
 * Indique si la ligne attribue le commit à un outil d'IA.
 * @param {string} line Ligne du message, sans espaces en bordure.
 * @returns {boolean} Vrai pour un co-auteur IA ou une mention « Generated with ».
 */
function isAiAttribution(line) {
  const isAiCoAuthor = CO_AUTHOR.test(line) && (AI_EMAIL.test(line) || AI_NAME.test(line));
  const isGeneratedMention = GENERATED_WITH.test(line) && AI_TOOL.test(line);
  return isAiCoAuthor || isGeneratedMention;
}

/**
 * Liste les lignes d'un message de commit qui attribuent le travail à une IA.
 * @param {string} message Message de commit complet.
 * @returns {string[]} Lignes fautives, vide si le message est conforme.
 */
export function findAiAttributions(message) {
  return message
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !isGitComment(line))
    .filter(isAiAttribution);
}

/**
 * Point d'entrée CLI : termine le processus en erreur si le message est refusé.
 * @param {string} messagePath Chemin du fichier contenant le message de commit.
 * @returns {void}
 */
function main(messagePath) {
  const offending = findAiAttributions(readFileSync(messagePath, "utf8"));
  if (offending.length === 0) return;
  console.error("Commit refusé : attribution à un outil d'IA détectée.");
  offending.forEach((line) => console.error(`  > ${line}`));
  console.error("Retirez ces lignes. Voir CONTRIBUTING.md, section « Paternité des commits ».");
  process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv[2] ?? ".git/COMMIT_EDITMSG");
}
