import { render, screen } from "@testing-library/react-native";

import { LegalContent } from "./content.legal";

describe("LegalContent", () => {
  it("affiche chaque section avec son titre et son texte", async () => {
    await render(
      <LegalContent
        sections={[
          { title: "Objet du service", body: "Mitemo aide à gérer des tontines." },
          { title: "Résiliation", body: "Le membre peut fermer son compte." },
        ]}
      />,
    );

    expect(screen.getByText("Objet du service")).toBeOnTheScreen();
    expect(screen.getByText("Le membre peut fermer son compte.")).toBeOnTheScreen();
  });
});
