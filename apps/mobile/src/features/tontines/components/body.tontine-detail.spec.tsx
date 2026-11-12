import { screen } from "@testing-library/react-native";

import { INITIAL_TONTINES } from "../../../shared/demo/demo.tontines";
import { firstOf } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontineDetailBody } from "./body.tontine-detail";

/** Actions inertes : le corps ne fait que les transmettre. */
const ACTIONS = {
  invite: jest.fn(),
  cancelInvitation: jest.fn(),
  start: jest.fn(),
  contribute: jest.fn(),
  confirm: jest.fn(),
  share: jest.fn(),
  remove: jest.fn(),
} satisfies TontineActionsState;

describe("TontineDetailBody", () => {
  it("montre la description et ouvre la fiche du membre demandé", async () => {
    const tontine = firstOf(INITIAL_TONTINES);
    await renderWithSafeArea(
      <TontineDetailBody item={tontine} actions={ACTIONS} focusMemberId="m2" paddingBottom={32} />,
    );

    expect(screen.getByText(tontine.description)).toBeOnTheScreen();
    expect(await screen.findByRole("header", { name: "Mama Nadège" })).toBeOnTheScreen();
  });
});
