import { render, screen } from "@testing-library/react-native";

import { ToastText } from "./text.toast";

describe("ToastText", () => {
  it("pose le titre au-dessus de la description", async () => {
    await render(<ToastText kind="success" title="Bravo Espoir !" message="Pointage réglé." />);

    expect(screen.getByText("Bravo Espoir !")).toBeOnTheScreen();
    expect(screen.getByText("Pointage réglé.")).toBeOnTheScreen();
  });
});
