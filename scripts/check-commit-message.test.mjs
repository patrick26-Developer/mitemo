import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findAiAttributions } from "./check-commit-message.mjs";

describe("findAiAttributions", () => {
  it("accepte un message sans attribution", () => {
    const message = "feat(ledger): refuser une écriture déséquilibrée\n\nRefs: #12\n";

    assert.deepEqual(findAiAttributions(message), []);
  });

  it("accepte un co-auteur humain", () => {
    const message = "fix(api): corriger le calcul\n\nCo-authored-by: Awa Mbemba <awa@exemple.cg>\n";

    assert.deepEqual(findAiAttributions(message), []);
  });

  it("accepte un co-auteur humain prénommé Claude", () => {
    const message = "feat: x\n\nCo-authored-by: Jean-Claude Mabiala <jc.mabiala@exemple.cg>\n";

    assert.deepEqual(findAiAttributions(message), []);
  });

  it("refuse un co-auteur Claude", () => {
    const line = "Co-Authored-By: Claude <noreply@anthropic.com>";

    assert.deepEqual(findAiAttributions(`feat: x\n\n${line}\n`), [line]);
  });

  it("refuse un co-auteur Copilot quelle que soit la casse", () => {
    const line = "co-authored-by: Copilot <175728472+Copilot@users.noreply.github.com>";

    assert.deepEqual(findAiAttributions(`feat: x\n\n${line}\n`), [line]);
  });

  it("refuse une mention Generated with", () => {
    const line = "Generated with [Claude Code](https://claude.com/claude-code)";

    assert.deepEqual(findAiAttributions(`feat: x\n\n${line}\n`), [line]);
  });

  it("ignore les lignes de commentaire de Git", () => {
    const message = "feat: x\n# Co-Authored-By: Claude <noreply@anthropic.com>\n";

    assert.deepEqual(findAiAttributions(message), []);
  });

  it("ne confond pas un mot du sujet avec une attribution", () => {
    const message = "docs: expliquer pourquoi on refuse les attributions openai\n";

    assert.deepEqual(findAiAttributions(message), []);
  });
});
