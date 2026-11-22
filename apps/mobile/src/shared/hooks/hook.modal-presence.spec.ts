import { act, renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

import { useModalPresence } from "./hook.modal-presence";

describe("useModalPresence", () => {
  const initialPlatform = Platform.OS;

  afterEach(() => {
    jest.useRealTimers();
    (Platform as { OS: string }).OS = initialPlatform;
  });

  it("sur iOS, retient une réouverture tant que la fermeture native n'est pas finie", async () => {
    (Platform as { OS: string }).OS = "ios";
    const { result, rerender } = await renderHook(
      ({ visible }: { visible: boolean }) => useModalPresence(visible),
      { initialProps: { visible: true } },
    );
    expect(result.current.shown).toBe(true);

    await rerender({ visible: false });
    await rerender({ visible: true });
    expect(result.current.shown).toBe(false);

    await act(async () => result.current.onDismiss());
    expect(result.current.shown).toBe(true);
  });

  it("sur iOS, rouvre quand même après un délai si la fin de fermeture ne vient pas", async () => {
    jest.useFakeTimers();
    (Platform as { OS: string }).OS = "ios";
    const { result, rerender } = await renderHook(
      ({ visible }: { visible: boolean }) => useModalPresence(visible),
      { initialProps: { visible: true } },
    );

    await rerender({ visible: false });
    await rerender({ visible: true });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    expect(result.current.shown).toBe(true);
  });

  it("sur Android, rouvre aussitôt", async () => {
    (Platform as { OS: string }).OS = "android";
    const { result, rerender } = await renderHook(
      ({ visible }: { visible: boolean }) => useModalPresence(visible),
      { initialProps: { visible: true } },
    );

    await rerender({ visible: false });
    expect(result.current.shown).toBe(false);
    await rerender({ visible: true });

    expect(result.current.shown).toBe(true);
  });
});
