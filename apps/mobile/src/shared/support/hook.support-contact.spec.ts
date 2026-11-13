import { act, renderHook, waitFor } from "@testing-library/react-native";
import { Linking } from "react-native";

import { useToastStore } from "../feedback/store.toast";
import { supportApi } from "./config.support";
import { useSupportContactStore } from "./store.support-contact";
import { useSupportContact } from "./hook.support-contact";

jest.mock("./config.support", () => ({ supportApi: { contact: jest.fn() } }));

/** Réponse du service client de test. */
const RESPONSE = { phoneNumber: "+242065706622", maxAgeSeconds: 86_400 };

describe("useSupportContact", () => {
  beforeEach(() => {
    useToastStore.getState().dismiss();
    useSupportContactStore.setState({ cache: null });
    jest.mocked(supportApi.contact).mockReset();
  });

  it("demande le numéro au backend puis le garde en cache", async () => {
    jest.mocked(supportApi.contact).mockResolvedValue(RESPONSE);
    const { result } = await renderHook(() => useSupportContact());

    await waitFor(() => expect(result.current.contact?.callUrl).toBe("tel:+242065706622"));
    expect(useSupportContactStore.getState().cache?.phoneNumber).toBe("+242065706622");
  });

  it("ne redemande pas un numéro encore frais", async () => {
    useSupportContactStore.setState({ cache: { ...RESPONSE, fetchedAt: Date.now() } });
    const { result } = await renderHook(() => useSupportContact());

    expect(result.current.contact?.whatsappUrl).toBe("https://wa.me/242065706622");
    expect(supportApi.contact).not.toHaveBeenCalled();
  });

  it("garde l'ancien numéro quand le backend ne répond pas", async () => {
    useSupportContactStore.setState({ cache: { ...RESPONSE, fetchedAt: 0 } });
    jest.mocked(supportApi.contact).mockRejectedValue(new Error("réseau"));
    const { result } = await renderHook(() => useSupportContact());

    await waitFor(() => expect(supportApi.contact).toHaveBeenCalled());
    expect(result.current.contact?.callUrl).toBe("tel:+242065706622");
  });

  it("ne propose rien sans numéro connu", async () => {
    jest.mocked(supportApi.contact).mockRejectedValue(new Error("404"));
    const { result } = await renderHook(() => useSupportContact());

    await waitFor(() => expect(supportApi.contact).toHaveBeenCalled());
    expect(result.current.contact).toBeNull();
  });

  it("explique en toast que l'application n'a pas pu s'ouvrir", async () => {
    jest.mocked(supportApi.contact).mockResolvedValue(RESPONSE);
    jest.spyOn(Linking, "openURL").mockRejectedValue(new Error("no handler"));
    const { result } = await renderHook(() => useSupportContact());

    await act(() => result.current.open("https://wa.me/242065706622"));

    expect(useToastStore.getState().toast?.kind).toBe("error");
  });
});
