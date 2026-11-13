import { render, screen } from "@testing-library/react-native";

import { useMemberStore } from "../../member/store.member";
import { ToastLead } from "./lead.toast";

describe("ToastLead", () => {
  it("montre la photo du membre après une réussite", async () => {
    useMemberStore.setState({ name: "Espoir LOEMBA", avatarInitial: "E", photoUri: null });
    await render(<ToastLead kind="success" />);

    expect(screen.getByTestId("toast-avatar")).toBeOnTheScreen();
    expect(screen.getByText("E")).toBeOnTheScreen();
  });

  it("montre une icône d'alerte après une erreur, sans photo", async () => {
    await render(<ToastLead kind="error" />);

    expect(screen.queryByTestId("toast-avatar")).toBeNull();
  });
});
