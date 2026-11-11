import { render, screen } from "@testing-library/react-native";

import { AUTH_FIELD_ICON_KINDS } from "./icon.auth-field";
import { AuthFieldIcon } from "./icon.auth-field";

describe("AuthFieldIcon", () => {
  it.each(AUTH_FIELD_ICON_KINDS)("dessine l'icône « %s »", async (kind) => {
    await render(<AuthFieldIcon kind={kind} color="#000000" testID={`icon-${kind}`} />);

    expect(screen.getByTestId(`icon-${kind}`)).toBeOnTheScreen();
  });
});
