import { renderHook } from "@testing-library/react-native";

import { useTabItemAnimation } from "./hook.tab-item-animation";

/*
 * Le double de Reanimated renvoie la valeur finale de chaque interpolation :
 * seules les formes d'arrivée sont vérifiables ici, pas les étapes du repli.
 */
describe("useTabItemAnimation", () => {
  it("élargit la pastille et montre le libellé de l'onglet actif", async () => {
    const { result } = await renderHook(() => useTabItemAnimation(true));

    expect(result.current.pillStyle).toMatchObject({ width: 132 });
    expect(result.current.labelStyle).toMatchObject({ opacity: 1 });
  });

  it("fournit les trois styles animés pour un onglet inactif", async () => {
    const { result } = await renderHook(() => useTabItemAnimation(false));

    expect(Object.keys(result.current)).toEqual(["pillStyle", "labelStyle", "iconStyle"]);
  });
});
