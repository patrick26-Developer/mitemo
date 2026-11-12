import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useCursorResource } from "./hook.cursor-resource";

it("parcourt les pages avec le curseur du serveur puis revient à la première page", async () => {
  const firstPage = { items: ["premier"], nextCursor: "cursor-1" };
  const load = jest
    .fn()
    .mockResolvedValueOnce(firstPage)
    .mockResolvedValueOnce({ items: ["second"] })
    .mockResolvedValueOnce(firstPage);
  const { result } = await renderHook(() => useCursorResource(load));
  await waitFor(() => expect(result.current.data).toEqual(firstPage));
  await act(async () => result.current.nextPage());
  await waitFor(() => expect(load).toHaveBeenLastCalledWith("cursor-1"));
  await act(async () => result.current.reload());
  await waitFor(() => expect(load).toHaveBeenLastCalledWith(undefined));
});
