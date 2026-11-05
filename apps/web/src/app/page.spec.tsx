import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("affiche le nom du produit comme titre principal", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: "Mitemo" })).toBeDefined();
  });

  it("présente la proposition de valeur", () => {
    render(<HomePage />);

    expect(screen.getByText(/épargne collective/i)).toBeDefined();
  });
});
