import { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";

import { MemberPhoto } from "../../../shared/components/atoms/photo.member";

/** Côté de la photo réduite, en points. */
const SMALL_SIZE = 72;

/** Marges de la feuille autour de la photo agrandie, en points. */
const SHEET_GUTTER = 40;

/** Props de la photo agrandissable d'un membre. */
export interface MemberZoomPhotoProps {
  readonly photoUri: string;
  readonly name: string;
}

/**
 * Photo d'un membre dans sa fiche : la toucher l'agrandit sur toute la
 * largeur de la feuille, la toucher encore la réduit.
 * @param props Photo et nom du membre.
 * @returns La photo agrandissable.
 */
export function MemberZoomPhoto(props: MemberZoomPhotoProps) {
  const [zoomed, setZoomed] = useState(false);
  const { width } = useWindowDimensions();
  const size = zoomed ? width - SHEET_GUTTER : SMALL_SIZE;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={zoomed ? "Réduire la photo" : "Agrandir la photo"}
      onPress={() => setZoomed((current) => !current)}
      className="items-center"
    >
      <MemberPhoto
        photoUri={props.photoUri}
        initial={props.name.slice(0, 1)}
        size={size}
        seed={props.name}
        testID="member-sheet-photo"
      />
    </Pressable>
  );
}
