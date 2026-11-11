import { render, screen } from "@testing-library/react-native";

import { FeedbackBanner } from "./banner.feedback";

describe("FeedbackBanner", () => {
  it("annonce le message aux lecteurs d'écran comme une alerte", async () => {
    await render(<FeedbackBanner kind="error" message="Solde insuffisant." />);

    expect(screen.getByRole("alert")).toHaveTextContent("Solde insuffisant.");
  });

  it("affiche aussi un succès", async () => {
    await render(<FeedbackBanner kind="success" message="Cotisation enregistrée." />);

    expect(screen.getByText("Cotisation enregistrée.")).toBeOnTheScreen();
  });
});
