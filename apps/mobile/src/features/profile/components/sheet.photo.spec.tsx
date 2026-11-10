import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { PHOTO_ERRORS } from "../hooks/hook.profile-photo";
import { PhotoSheet } from "./sheet.photo";

describe("PhotoSheet", () => {
  it("propose la galerie et l'appareil photo", async () => {
    await renderWithSafeArea(
      <PhotoSheet
        visible
        onClose={jest.fn()}
        onPickFromLibrary={jest.fn()}
        onTakePhoto={jest.fn()}
      />,
    );

    expect(screen.getByRole("header", { name: "Photo de profil" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Choisir dans la galerie" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Prendre une photo" })).toBeOnTheScreen();
  });

  it("ouvre la galerie", async () => {
    const onPickFromLibrary = jest.fn();
    await renderWithSafeArea(
      <PhotoSheet
        visible
        onClose={jest.fn()}
        onPickFromLibrary={onPickFromLibrary}
        onTakePhoto={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Choisir dans la galerie" }));

    expect(onPickFromLibrary).toHaveBeenCalledTimes(1);
  });

  it("ouvre l'appareil photo", async () => {
    const onTakePhoto = jest.fn();
    await renderWithSafeArea(
      <PhotoSheet
        visible
        onClose={jest.fn()}
        onPickFromLibrary={jest.fn()}
        onTakePhoto={onTakePhoto}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Prendre une photo" }));

    expect(onTakePhoto).toHaveBeenCalledTimes(1);
  });

  it("affiche l'échec sans fermer la feuille", async () => {
    await renderWithSafeArea(
      <PhotoSheet
        visible
        errorMessage={PHOTO_ERRORS.library}
        onClose={jest.fn()}
        onPickFromLibrary={jest.fn()}
        onTakePhoto={jest.fn()}
      />,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(PHOTO_ERRORS.library);
    expect(screen.getByRole("button", { name: "Choisir dans la galerie" })).toBeOnTheScreen();
  });
});
