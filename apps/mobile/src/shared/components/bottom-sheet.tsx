import { X } from "lucide-react-native";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PALETTE } from "../theme/palette";
import { SheetBackdrop } from "./sheet-backdrop";

/** Course d'ouverture de la feuille, en points. */
const OPEN_OFFSET = 560;

/** Ressort d'ouverture : rapide, avec une arrivée amortie. */
const OPEN_SPRING = { damping: 24, stiffness: 240, mass: 0.9, useNativeDriver: true };

/** Durée de fermeture, en millisecondes. */
const CLOSE_DURATION = 180;

/** Props d'une feuille modale ancrée en bas de l'écran. */
export interface BottomSheetProps {
  readonly visible: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

/**
 * Affiche un contenu dans une feuille qui monte depuis le bas, plutôt que dans
 * une nouvelle page : le contexte de l'écran reste visible derrière.
 * @param props Visibilité, titre, fermeture et contenu.
 * @returns La feuille modale.
 */
export function BottomSheet(props: BottomSheetProps) {
  const { visible, title, onClose, children } = props;
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(OPEN_OFFSET));

  useEffect(() => {
    if (!visible) {
      translateY.setValue(OPEN_OFFSET);
      return;
    }

    Animated.spring(translateY, { toValue: 0, ...OPEN_SPRING }).start();
  }, [visible, translateY]);

  const close = () => closeSheet(translateY, onClose);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      <View className="flex-1 justify-end">
        <SheetBackdrop onPress={close} />
        <SheetSurface
          translateY={translateY}
          title={title}
          onClose={close}
          bottomInset={insets.bottom}
        >
          {children}
        </SheetSurface>
      </View>
    </Modal>
  );
}

/**
 * Ramène la feuille hors de l'écran avant de prévenir son propriétaire.
 * @param translateY Translation animée de la feuille.
 * @param onClose Fermeture demandée par le propriétaire.
 */
function closeSheet(translateY: Animated.Value, onClose: () => void): void {
  Animated.timing(translateY, {
    toValue: OPEN_OFFSET,
    duration: CLOSE_DURATION,
    useNativeDriver: true,
  }).start(() => {
    translateY.setValue(OPEN_OFFSET);
    onClose();
  });
}

/** Props de la surface animée d'une feuille. */
interface SheetSurfaceProps {
  readonly translateY: Animated.Value;
  readonly title: string;
  readonly onClose: () => void;
  readonly bottomInset: number;
  readonly children: ReactNode;
}

/**
 * Rend la surface de la feuille, son en-tête et son contenu défilant.
 * @param props Translation courante, en-tête, fermeture et marge basse.
 * @returns La surface animée.
 */
function SheetSurface(props: SheetSurfaceProps) {
  const { translateY, title, onClose, bottomInset, children } = props;

  return (
    <Animated.View
      testID="bottom-sheet"
      className="max-h-[90%] rounded-t-[24px] border border-b-0 border-card-border bg-white px-5 pt-4"
      style={[styles.surface, { transform: [{ translateY }], paddingBottom: bottomInset + 20 }]}
    >
      <View className="mb-3 items-center">
        <View className="h-1 w-10 rounded-full bg-ink/20" />
      </View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text accessibilityRole="header" className="flex-1 text-[20px] font-bold text-ink">
          {title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          hitSlop={8}
          onPress={onClose}
          className="h-9 w-9 items-center justify-center rounded-full bg-brand-veil"
        >
          <X size={18} color={PALETTE.brand} />
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-4 pb-2"
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

/** Ombre portée de la feuille, que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  surface: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 24,
  },
});
