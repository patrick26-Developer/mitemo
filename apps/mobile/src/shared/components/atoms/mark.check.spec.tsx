import { render, screen } from "@testing-library/react-native";

import { CheckMark } from "./mark.check";

describe("CheckMark", () => {
  it("est vide tant que l'étape n'est pas faite, cochée ensuite", async () => {
    await render(<CheckMark done={false} accent="#CFD8FF" />);
    expect(screen.getByTestId("check-mark-empty")).toBeOnTheScreen();

    await render(<CheckMark done accent="#CFD8FF" />);
    expect(screen.getByTestId("check-mark")).toBeOnTheScreen();
  });
});
