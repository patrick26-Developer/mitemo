import type { File as FileSystemFile } from "expo-file-system";
import { ImageManipulator } from "expo-image-manipulator";

import {
  PROFILE_PHOTO_FILE_PREFIX,
  PROFILE_PHOTO_QUALITY,
  PROFILE_PHOTO_WIDTH,
  saveProfilePhoto,
} from "./profile-photo-file";

const mockCopy = jest.fn();
const mockDelete = jest.fn();
const mockList = jest.fn();
const mockResize = jest.fn();
const mockRenderAsync = jest.fn();
const mockSaveAsync = jest.fn();

jest.mock("expo-image-manipulator", () => ({
  ImageManipulator: { manipulate: jest.fn() },
  SaveFormat: { JPEG: "jpeg" },
}));

jest.mock("expo-file-system", () => {
  class MockFile {
    readonly uri: string;
    readonly name: string;

    constructor(...parts: readonly (string | { readonly uri: string })[]) {
      this.uri = parts.map((part) => (typeof part === "string" ? part : part.uri)).join("");
      this.name = this.uri.slice(this.uri.lastIndexOf("/") + 1);
    }

    copy = mockCopy;
    delete = mockDelete;
  }

  class MockDirectory {
    list = mockList;
  }

  return {
    Directory: MockDirectory,
    File: MockFile,
    Paths: { document: { uri: "file:///documents/" } },
  };
});

/** Classe `File` du module de système de fichiers remplacé par le test. */
interface FileSystemMock {
  readonly File: new (...parts: readonly string[]) => FileSystemFile;
}

const manipulate = jest.mocked(ImageManipulator.manipulate);
const fileSystem = jest.requireMock<FileSystemMock>("expo-file-system");

describe("saveProfilePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    manipulate.mockReturnValue({ resize: mockResize } as unknown as ReturnType<
      typeof ImageManipulator.manipulate
    >);
    mockResize.mockReturnValue({ renderAsync: mockRenderAsync });
    mockRenderAsync.mockResolvedValue({ saveAsync: mockSaveAsync });
    mockSaveAsync.mockResolvedValue({ uri: "file:///cache/resized.jpg" });
    mockList.mockReturnValue([]);
  });

  it("redimensionne et compresse la photo choisie", async () => {
    await saveProfilePhoto("file:///gallery/photo.jpg", 1000);

    expect(manipulate).toHaveBeenCalledWith("file:///gallery/photo.jpg");
    expect(mockResize).toHaveBeenCalledWith({ width: PROFILE_PHOTO_WIDTH });
    expect(mockSaveAsync).toHaveBeenCalledWith({
      compress: PROFILE_PHOTO_QUALITY,
      format: "jpeg",
    });
  });

  it("conserve la photo sous un nom propre à ce choix", async () => {
    const uri = await saveProfilePhoto("file:///gallery/photo.jpg", 1000);

    expect(uri).toBe(`file:///documents/${PROFILE_PHOTO_FILE_PREFIX}-1000.jpg`);
    expect(mockCopy).toHaveBeenCalledWith(expect.objectContaining({ uri }), { overwrite: true });
  });

  it("supprime la photo du choix précédent", async () => {
    const previous = new fileSystem.File(`file:///documents/${PROFILE_PHOTO_FILE_PREFIX}-1.jpg`);
    mockList.mockReturnValue([previous]);

    await saveProfilePhoto("file:///gallery/photo.jpg", 1000);

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it("ne supprime pas la nouvelle photo ni les fichiers étrangers", async () => {
    const current = new fileSystem.File(`file:///documents/${PROFILE_PHOTO_FILE_PREFIX}-1000.jpg`);
    const unrelated = new fileSystem.File("file:///documents/export.csv");
    mockList.mockReturnValue([current, unrelated]);

    await saveProfilePhoto("file:///gallery/photo.jpg", 1000);

    expect(mockDelete).not.toHaveBeenCalled();
  });
});
