import { act, renderHook } from "@testing-library/react-native";

import { IDLE_CHECK_MS, useAutoLock } from "./hook.auto-lock";
import { useActivityStore } from "./store.activity";
import { useAutoLockStore } from "./store.auto-lock";
import { INITIAL_SESSION, useSessionStore } from "./store.session";

describe("useAutoLock", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: Date.parse("2026-11-13T09:00:00.000Z") });
    useSessionStore.setState({ ...INITIAL_SESSION, signedIn: true });
    useAutoLockStore.setState({ minutes: 5 });
  });

  afterEach(() => jest.useRealTimers());

  it("verrouille la session après cinq minutes sans geste", async () => {
    await renderHook(() => useAutoLock());

    await act(() => jest.advanceTimersByTime(4 * 60_000));
    expect(useSessionStore.getState().locked).toBe(false);
    await act(() => jest.advanceTimersByTime(60_000 + IDLE_CHECK_MS));

    expect(useSessionStore.getState().locked).toBe(true);
  });

  it("repousse le verrouillage à chaque toucher", async () => {
    await renderHook(() => useAutoLock());

    await act(() => jest.advanceTimersByTime(4 * 60_000));
    useActivityStore.getState().touch();
    await act(() => jest.advanceTimersByTime(4 * 60_000));

    expect(useSessionStore.getState().locked).toBe(false);
  });

  it("suit la durée choisie dans le profil", async () => {
    useAutoLockStore.setState({ minutes: 1 });
    await renderHook(() => useAutoLock());

    await act(() => jest.advanceTimersByTime(60_000 + IDLE_CHECK_MS));

    expect(useSessionStore.getState().locked).toBe(true);
  });

  it("ne surveille rien sans session", async () => {
    useSessionStore.setState(INITIAL_SESSION);
    await renderHook(() => useAutoLock());

    await act(() => jest.advanceTimersByTime(10 * 60_000));

    expect(useSessionStore.getState().locked).toBe(false);
  });
});
