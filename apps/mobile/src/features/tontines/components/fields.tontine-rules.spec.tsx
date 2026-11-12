import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineRulesFields } from "./fields.tontine-rules";

/** Saisie de départ. */
const FORM = { name: "Tontine", contribution: "5000", cadence: "semaine-1", tint: 0 };

describe("TontineRulesFields", () => {
  it("laisse modifier la cotisation avant le lancement", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(<TontineRulesFields form={FORM} locked={false} onChange={onChange} />);

    await fireEvent.changeText(screen.getByLabelText("Cotisation par tour (FCFA)"), "7000");

    expect(onChange).toHaveBeenCalledWith({ contribution: "7000" });
    expect(screen.getByText("Fréquence des tours")).toBeOnTheScreen();
  });

  it("explique pourquoi les règles sont figées", async () => {
    await renderWithSafeArea(<TontineRulesFields form={FORM} locked onChange={jest.fn()} />);

    expect(screen.queryByLabelText("Cotisation par tour (FCFA)")).toBeNull();
  });
});
