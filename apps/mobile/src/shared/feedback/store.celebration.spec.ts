import { useCelebrationStore } from "./store.celebration";

describe("useCelebrationStore", () => {
  beforeEach(() => useCelebrationStore.setState({ burst: null }));

  it("lance une nouvelle salve à chaque célébration, pour rejouer l'animation", () => {
    useCelebrationStore.getState().celebrate();
    const first = useCelebrationStore.getState().burst;
    useCelebrationStore.getState().celebrate();

    expect(first).not.toBeNull();
    expect(useCelebrationStore.getState().burst).not.toBe(first);
  });

  it("efface la salve une fois jouée", () => {
    useCelebrationStore.getState().celebrate();
    useCelebrationStore.getState().finish();

    expect(useCelebrationStore.getState().burst).toBeNull();
  });
});
