import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PayPendingStep } from "./step.pay-pending";

describe("PayPendingStep", () => {
  it("annonce l'attente et numérote les instructions", async () => {
    await renderWithSafeArea(
      <PayPendingStep operator="MTN MoMo" instructions={["Ouvrez", "Validez"]} accent="#2044DF" />,
    );

    expect(
      screen.getByRole("header", { name: "En attente de validation MTN MoMo" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("2.")).toBeOnTheScreen();
    expect(screen.getByText("Validez")).toBeOnTheScreen();
  });
});
