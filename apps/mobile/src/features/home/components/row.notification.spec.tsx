import { fireEvent, render, screen } from "@testing-library/react-native";

import type { NotificationItem } from "../../../shared/notifications/hook.notifications";
import { NotificationRow, UNREAD_BACKGROUND } from "./row.notification";

/** Invitation non lue, avec l'avatar de qui invite. */
const INVITATION: NotificationItem = {
  id: "invitation-i1",
  title: "Mama Nadège vous invite",
  message: "Rejoignez « Poto » et choisissez vos tours.",
  time: "À répondre",
  visual: { kind: "avatar", name: "Mama Nadège" },
  href: "/invitation/i1",
  area: "tontines",
  subject: "tontine:4",
  read: false,
};

describe("NotificationRow", () => {
  it("garde un fond bleu pâle et un point tant qu'elle n'est pas touchée", async () => {
    await render(<NotificationRow item={INVITATION} separated={false} onPress={jest.fn()} />);

    expect(screen.getByText("M")).toBeOnTheScreen();
    expect(screen.getByRole("button")).toHaveStyle({ backgroundColor: UNREAD_BACKGROUND });
    expect(screen.getByTestId("notification-unread")).toBeOnTheScreen();
  });

  it("perd fond et point une fois lue, et se sépare de la précédente par un filet", async () => {
    const due = { ...INVITATION, visual: { kind: "icon", icon: "due" }, read: true } as const;
    await render(<NotificationRow item={due} separated onPress={jest.fn()} />);

    expect(screen.getByTestId("notification-icon-due")).toBeOnTheScreen();
    expect(screen.getByRole("button")).not.toHaveStyle({ backgroundColor: UNREAD_BACKGROUND });
    expect(screen.getByRole("button").props["style"]).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderTopWidth: expect.any(Number) })]),
    );
    expect(screen.queryByTestId("notification-unread")).toBeNull();
  });

  it("coupe les textes trop longs par « … »", async () => {
    await render(<NotificationRow item={INVITATION} separated={false} onPress={jest.fn()} />);

    expect(screen.getByText(INVITATION.title).props["numberOfLines"]).toBe(1);
    expect(screen.getByText(INVITATION.message).props["numberOfLines"]).toBe(2);
  });

  it("ouvre l'endroit concerné au toucher de toute la ligne", async () => {
    const onPress = jest.fn();
    await render(<NotificationRow item={INVITATION} separated={false} onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: /Mama Nadège vous invite/ }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
