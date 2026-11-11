import { render, screen } from "@testing-library/react-native";

import { AuthErrorText } from "./text.auth-error";

describe("AuthErrorText", () => {
  it("annonce le message comme une alerte", async () => {
    await render(<AuthErrorText message="Code incorrect." />);

    expect(screen.getByRole("alert")).toHaveTextContent("Code incorrect.");
  });

  it("n'affiche rien sans message", async () => {
    await render(<AuthErrorText message="" />);

    expect(screen.queryByRole("alert")).toBeNull();
  });
});
