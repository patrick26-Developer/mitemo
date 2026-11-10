import { screen } from "@testing-library/react-native";
import { BadgeCheck } from "lucide-react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetBadge } from "./badge.sheet";

describe("SheetBadge", () => {
  it("affiche le libellé du statut", async () => {
    await renderWithSafeArea(<SheetBadge icon={BadgeCheck} label="Compte vérifié" />);

    expect(screen.getByText("Compte vérifié")).toBeOnTheScreen();
  });
});
