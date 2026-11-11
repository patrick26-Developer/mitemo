import { render, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../../shared/member/store.member";
import { SecuritySheet } from "./sheet.security";

describe("SecuritySheet", () => {
  beforeEach(() => useMemberStore.setState(INITIAL_MEMBER_PROFILE));

  it("affiche le numéro et la façon dont le code est protégé", async () => {
    await render(<SecuritySheet />);

    expect(screen.getByText(INITIAL_MEMBER_PROFILE.phone)).toBeOnTheScreen();
    expect(screen.getByText("Demandé à chaque ouverture")).toBeOnTheScreen();
    expect(screen.getByText(/seule son empreinte est conservée/)).toBeOnTheScreen();
  });
});
