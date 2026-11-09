import { X } from "lucide-react-native";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import type { GestureResponderHandlers } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKeyboardHeight } from "../hooks/use-keyboard-height";
import { useSheetDrag } from "../hooks/use-sheet-drag";
import type { SheetLayout } from "../model/sheet-layout";
import { computeSheetLayout } from "../model/sheet-layout";
import { PALETTE } from "../theme/palette";
import { SHEET_HANDLE_SHAPE, computeSheetCardStyle } from "../theme/sheet-card";
import { SHEET_OPEN_OFFSET, closeSheet, openSheet } from "./sheet-animation";
import { SheetBackdrop } from "./sheet-backdrop";

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
 *
 * La feuille reprend la carte d'authentification : mêmes marges, mêmes coins,
 * même marge basse constante. Le clavier ne la déplace pas, sa place est
 * réservée sous le contenu, qui grandit vers le haut.
 * @param props Visibilité, titre, fermeture et contenu.
 * @returns La feuille modale.
 */
export function BottomSheet(props: BottomSheetProps) {
  const { visible, title, onClose, children } = props;
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { height: screenHeight } = useWindowDimensions();
  const [translateY] = useState(() => new Animated.Value(SHEET_OPEN_OFFSET));
  const layout = computeSheetLayout({
    platform: Platform.OS === "android" ? "android" : "ios",
    keyboardHeight,
    bottomInset: insets.bottom,
    screenHeight,
  });

  useEffect(() => {
    if (!visible) {
      translateY.setValue(SHEET_OPEN_OFFSET);
      return;
    }

    openSheet(translateY);
  }, [visible, translateY]);

  const close = () => closeSheet(translateY, onClose);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
    >
      <View className="flex-1 justify-end">
        <SheetBackdrop onPress={close} />
        <SheetSurface translateY={translateY} title={title} onClose={close} layout={layout}>
          {children}
        </SheetSurface>
      </View>
    </Modal>
  );
}

/** Props de la surface animée d'une feuille. */
interface SheetSurfaceProps {
  readonly translateY: Animated.Value;
  readonly title: string;
  readonly onClose: () => void;
  readonly layout: SheetLayout;
  readonly children: ReactNode;
}

/** Props de l'en-tête glissable d'une feuille. */
interface SheetHeaderProps {
  readonly title: string;
  readonly onClose: () => void;
  readonly dragHandlers: GestureResponderHandlers;
}

/**
 * Rend la poignée, le titre et le bouton de fermeture de la feuille.
 * @param props Titre, fermeture et gestionnaires du glissement.
 * @returns L'en-tête glissable.
 */
function SheetHeader(props: SheetHeaderProps) {
  const { title, onClose, dragHandlers } = props;

  return (
    <View {...dragHandlers}>
      <View className="mb-3 items-center">
        <View className="bg-ink/20" style={SHEET_HANDLE_SHAPE} />
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
    </View>
  );
}

/**
 * Rend la surface de la feuille, son en-tête glissable et son contenu défilant.
 * La forme vient de `computeSheetCardStyle`, la même que la carte
 * d'authentification.
 * @param props Translation courante, en-tête, fermeture et dimensions.
 * @returns La surface animée.
 */
function SheetSurface(props: SheetSurfaceProps) {
  const { translateY, title, onClose, layout, children } = props;
  const panHandlers = useSheetDrag(translateY, onClose);

  return (
    <Animated.View
      testID="bottom-sheet"
      accessibilityViewIsModal
      importantForAccessibility="yes"
      className="border-card-border"
      style={[styles.surface, computeSheetCardStyle(layout), { transform: [{ translateY }] }]}
    >
      <SheetHeader title={title} onClose={onClose} dragHandlers={panHandlers} />
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
