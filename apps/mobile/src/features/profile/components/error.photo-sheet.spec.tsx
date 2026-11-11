import { render, screen } from "@testing-library/react-native";

import { PhotoSheetError } from "./error.photo-sheet";

describe("PhotoSheetError", () => {
  it("annonce l'erreur comme une alerte", async () => {
    await render(<PhotoSheetError message="La photo n'a pas pu être enregistrée." />);

    expect(screen.getByRole("alert")).toHaveTextContent("La photo n'a pas pu être enregistrée.");
  });
});
