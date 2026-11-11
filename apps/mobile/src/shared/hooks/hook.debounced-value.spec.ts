import { act, renderHook } from "@testing-library/react-native";

import { useDebouncedValue } from "./hook.debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("ne transmet la valeur qu'après le délai sans nouvelle saisie", async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 200),
      { initialProps: { value: "" } },
    );

    await rerender({ value: "lo" });
    await act(() => jest.advanceTimersByTime(150));
    await rerender({ value: "loyer" });
    await act(() => jest.advanceTimersByTime(150));

    expect(result.current).toBe("");

    await act(() => jest.advanceTimersByTime(50));

    expect(result.current).toBe("loyer");
  });
});
