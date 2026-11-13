import { SUCCESS_TOAST_MS, toastDuration, toastTitle } from "./model.toast-content";

describe("toastTitle", () => {
  it("félicite le membre par son prénom après une réussite", () => {
    expect(toastTitle("success", "Espoir LOEMBA")).toBe("Bravo Espoir !");
  });

  it("félicite sans prénom quand le nom manque", () => {
    expect(toastTitle("success", "  ")).toBe("Bravo !");
  });

  it("annonce un contretemps après une erreur", () => {
    expect(toastTitle("error", "Espoir LOEMBA")).toBe("Un petit souci");
  });
});

describe("toastDuration", () => {
  it("n'affiche une réussite qu'une seconde", () => {
    expect(SUCCESS_TOAST_MS).toBe(1000);
    expect(toastDuration("success")).toBe(1000);
  });

  it("laisse une erreur assez longtemps pour être lue", () => {
    expect(toastDuration("error")).toBeGreaterThan(SUCCESS_TOAST_MS);
  });
});
