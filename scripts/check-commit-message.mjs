// Refuse les messages de commit qui attribuent le travail à un assistant d'IA.
// Utilisé par le hook commit-msg et par la CI sur chaque commit d'une pull request.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const AI_EMAIL = /<[^>]*(anthropic|openai|copilot|cursor|codeium|tabnine|devin|gemini)[^>]*>/i;
const AI_NAME = /^co-authored-by:\s*(claude|copilot|chatgpt|gemini|cursor|devin)\s*</i;
const AI_TOOL = /claude|chatgpt|copilot|gemini|cursor|codeium|tabnine|devin/i;
const CO_AUTHOR = /^co-authored-by:/i;
const GENERATED_WITH = /generated (with|by)/i;

function isGitComment(line) {
  return line.trimStart().startsWith("#");
}

function isAiAttribution(line) {
  const isAiCoAuthor = CO_AUTHOR.test(line) && (AI_EMAIL.test(line) || AI_NAME.test(line));
  const isGeneratedMention = GENERATED_WITH.test(line) && AI_TOOL.test(line);
  return isAiCoAuthor || isGeneratedMention;
}

export function findAiAttributions(message) {
  return message
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !isGitComment(line))
    .filter(isAiAttribution);
}

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
