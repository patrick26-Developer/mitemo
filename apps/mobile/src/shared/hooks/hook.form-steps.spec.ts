import { act, renderHook } from "@testing-library/react-native";

import { useFormSteps } from "./hook.form-steps";

describe("useFormSteps", () => {
  it("parcourt les étapes et revient à la première", async () => {
    const { result } = await renderHook(() => useFormSteps(2));
    expect(result.current).toMatchObject({ index: 0, total: 2, isFirst: true, isLast: false });

    await act(() => result.current.next());
    expect(result.current).toMatchObject({ index: 1, isFirst: false, isLast: true });

    await act(() => result.current.back());
    expect(result.current.index).toBe(0);

    await act(() => result.current.next());
    await act(() => result.current.reset());
    expect(result.current.index).toBe(0);
  });
});
