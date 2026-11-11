import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { HomeActions } from "./actions.home";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("HomeActions", () => {
  it("ouvre la recherche", async () => {
    await render(<HomeActions topInset={0} onOpenNotifications={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Rechercher" }));

    expect(router.push).toHaveBeenCalledWith("/search");
  });

  it("ouvre les notifications", async () => {
    const onOpenNotifications = jest.fn();
    await render(<HomeActions topInset={0} onOpenNotifications={onOpenNotifications} />);

    await fireEvent.press(screen.getByRole("button", { name: "Notifications" }));

    expect(onOpenNotifications).toHaveBeenCalledTimes(1);
  });
});
