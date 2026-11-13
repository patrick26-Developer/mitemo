import { fireEvent, render, screen } from "@testing-library/react-native";

import { playFeedbackSound } from "../../feedback/api.feedback-effects";
import { SheetStepsFooter } from "./footer.sheet-steps";

jest.mock("../../feedback/api.feedback-effects", () => ({
  playFeedbackSound: jest.fn(async () => true),
}));

describe("SheetStepsFooter", () => {
  it("ne propose que « Continuer » à la première étape", async () => {
    const onNext = jest.fn();
    await render(
      <SheetStepsFooter
        isFirst
        isLast={false}
        finalLabel="Créer"
        onBack={jest.fn()}
        onNext={onNext}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(playFeedbackSound).toHaveBeenCalledWith("add");
  });

  it("propose « Retour » et l'action finale côte à côte à la dernière étape", async () => {
    const onBack = jest.fn();
    const onNext = jest.fn();
    await render(
      <SheetStepsFooter
        isFirst={false}
        isLast
        finalLabel="Créer"
        onBack={onBack}
        onNext={onNext}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));
    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));

    expect(screen.getByTestId("sheet-action-row")).toBeOnTheScreen();
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
