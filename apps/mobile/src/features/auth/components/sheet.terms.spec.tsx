import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TERMS_POINTS } from "../model/model.terms";
import { TermsSheet } from "./sheet.terms";

describe("TermsSheet", () => {
  it("rappelle chaque condition et propose Refuser et Accepter", async () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();
    await renderWithSafeArea(<TermsSheet visible onAccept={onAccept} onDecline={onDecline} />);

    for (const point of TERMS_POINTS) expect(screen.getByText(point)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Refuser" }));
    await fireEvent.press(screen.getByRole("button", { name: "Accepter" }));

    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledTimes(1);
  });
});
