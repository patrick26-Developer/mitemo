import { isOnline, nextConnectionStatus } from "./model.connection-status";

describe("isOnline", () => {
  it("considère l'appareil connecté tant que rien ne dit le contraire", () => {
    expect(isOnline({})).toBe(true);
    expect(isOnline({ isConnected: true, isInternetReachable: true })).toBe(true);
  });

  it("repère un appareil sans réseau ou sans accès à Internet", () => {
    expect(isOnline({ isConnected: false })).toBe(false);
    expect(isOnline({ isConnected: true, isInternetReachable: false })).toBe(false);
  });
});

describe("nextConnectionStatus", () => {
  it("passe hors ligne dès que le réseau tombe", () => {
    expect(nextConnectionStatus("online", false)).toBe("offline");
    expect(nextConnectionStatus("restored", false)).toBe("offline");
  });

  it("annonce le retour du réseau après une coupure", () => {
    expect(nextConnectionStatus("offline", true)).toBe("restored");
  });

  it("reste silencieux quand le réseau était déjà là", () => {
    expect(nextConnectionStatus("online", true)).toBe("online");
    expect(nextConnectionStatus("restored", true)).toBe("restored");
  });
});
