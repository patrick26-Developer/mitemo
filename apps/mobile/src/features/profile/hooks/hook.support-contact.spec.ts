import { act, renderHook } from "@testing-library/react-native";
import { Linking } from "react-native";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { useSupportContact } from "./hook.support-contact";

describe("useSupportContact", () => {
  beforeEach(() => useToastStore.getState().dismiss());

  it("ouvre WhatsApp ou le téléphone avec le lien demandé", async () => {
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
    const { result } = await renderHook(() => useSupportContact());

    await act(() => result.current.open("tel:+242065706622"));

    expect(openURL).toHaveBeenCalledWith("tel:+242065706622");
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("explique en toast que l'application n'a pas pu s'ouvrir", async () => {
    jest.spyOn(Linking, "openURL").mockRejectedValue(new Error("no handler"));
    const { result } = await renderHook(() => useSupportContact());

    await act(() => result.current.open("https://wa.me/242065706622"));

    expect(useToastStore.getState().toast?.kind).toBe("error");
  });
});
