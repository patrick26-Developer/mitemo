import { act, renderHook } from "@testing-library/react-native";

import { formError, formOk } from "../model/model.form-result";
import type { StepFormConfig } from "./hook.step-form";
import { useStepForm } from "./hook.step-form";

/** Formulaire minimal à deux étapes : un nom puis un âge. */
interface DemoForm {
  readonly name: string;
  readonly age: string;
}

/**
 * Construit une configuration de test dont chaque rappel est espionné.
 * @returns La configuration du formulaire de démonstration.
 */
function demoConfig(): StepFormConfig<DemoForm, string> {
  return {
    initial: { name: "", age: "" },
    total: 2,
    validateStep: (form, step) => (step === 0 && form.name === "" ? "Nom requis." : null),
    parse: (form) =>
      form.age === "" ? formError("Âge requis.") : formOk(`${form.name}:${form.age}`),
    onCreate: jest.fn(),
    onDone: jest.fn(),
  };
}

describe("useStepForm", () => {
  it("bloque l'étape courante tant qu'elle est invalide", async () => {
    const { result } = await renderHook(() => useStepForm(demoConfig()));

    await act(() => result.current.next());

    expect(result.current.error).toBe("Nom requis.");
    expect(result.current.steps.index).toBe(0);
  });

  it("passe à l'étape suivante puis revient en effaçant l'erreur", async () => {
    const { result } = await renderHook(() => useStepForm(demoConfig()));

    await act(() => result.current.update({ name: "Grâce" }));
    await act(() => result.current.next());
    expect(result.current.steps.index).toBe(1);

    await act(() => result.current.next());
    expect(result.current.error).toBe("Âge requis.");

    await act(() => result.current.back());
    expect(result.current).toMatchObject({ error: null, form: { name: "Grâce" } });
    expect(result.current.steps.index).toBe(0);
  });

  it("crée à la dernière étape puis repart d'un formulaire vierge", async () => {
    const config = demoConfig();
    const { result } = await renderHook(() => useStepForm(config));

    await act(() => result.current.update({ name: "Grâce", age: "30" }));
    await act(() => result.current.next());
    await act(() => result.current.next());

    expect(config.onCreate).toHaveBeenCalledWith("Grâce:30");
    expect(config.onDone).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({ error: null, form: { name: "", age: "" } });
    expect(result.current.steps.index).toBe(0);
  });

  it("garde la saisie à la fermeture mais repart de la première étape", async () => {
    const config = demoConfig();
    const { result } = await renderHook(() => useStepForm(config));

    await act(() => result.current.update({ name: "Grâce" }));
    await act(() => result.current.next());
    await act(() => result.current.close());

    expect(config.onDone).toHaveBeenCalledTimes(1);
    expect(config.onCreate).not.toHaveBeenCalled();
    expect(result.current.form.name).toBe("Grâce");
    expect(result.current.steps.index).toBe(0);
  });
});
