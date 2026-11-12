import { ChevronLeft, X } from "lucide-react-native";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import type { GestureResponderHandlers, ScrollViewInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFocusedFieldReveal } from "../../hooks/hook.focused-field-reveal";
import { useKeyboardHeight } from "../../hooks/hook.keyboard-height";
import { useSheetDrag } from "../../hooks/hook.sheet-drag";
import type { SheetLayout } from "../../model/model.sheet-layout";
import { computeSheetLayout, sheetContentPaddingBottom } from "../../model/model.sheet-layout";
import { FOCUS_RING_SCROLL } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";
import { SHADOWS } from "../../theme/theme.shadow";
import { SHEET_HANDLE_SHAPE, computeSheetCardStyle } from "../../theme/theme.sheet-card";
import { SHEET_OPEN_OFFSET, closeSheet, openSheet } from "../../model/model.sheet-animation";
import { SheetBackdrop } from "../atoms/backdrop.sheet";
import { ToastHost } from "./host.toast";

/** Props d'une feuille modale ancrée en bas de l'écran. */
export interface BottomSheetProps {
  readonly visible: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
  /**
   * Actions posées à la fin du contenu, par exemple « Continuer » : elles
   * défilent avec lui, sur iOS comme sur Android.
   */
  readonly footer?: ReactNode;
  /**
   * Retour à l'étape précédente, par exemple du code PIN au choix du moyen :
   * posé en haut, à gauche du titre.
   */
  readonly onBack?: () => void;
}

/**
 * Garde une fermeture stable d'un rendu à l'autre : le geste de glissement
 * n'est pas recréé en plein mouvement quand la feuille se redessine.
 * @param translateY Translation animée de la feuille.
 * @param onClose Fermeture demandée par le propriétaire.
 * @returns La fermeture animée, stable.
 */
function useStableClose(translateY: Animated.Value, onClose: () => void): () => void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  return useCallback(() => closeSheet(translateY, () => onCloseRef.current()), [translateY]);
}

/**
 * Suit le clavier, la zone sûre et la hauteur d'écran pour borner la feuille.
 * @returns La hauteur du clavier et les dimensions de la feuille.
 */
function useSheetLayout(): { readonly keyboardHeight: number; readonly layout: SheetLayout } {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { height: screenHeight } = useWindowDimensions();
  const layout = computeSheetLayout({
    platform: Platform.OS === "android" ? "android" : "ios",
    keyboardHeight,
    bottomInset: insets.bottom,
    screenHeight,
  });

  return { keyboardHeight, layout };
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
  const { visible, title, onClose, children, footer, onBack } = props;
  const { keyboardHeight, layout } = useSheetLayout();
  const [translateY] = useState(() => new Animated.Value(SHEET_OPEN_OFFSET));
  useEffect(() => {
    if (!visible) {
      translateY.setValue(SHEET_OPEN_OFFSET);
      return;
    }

    openSheet(translateY);
  }, [visible, translateY]);

  const close = useStableClose(translateY, onClose);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
    >
      <View accessibilityViewIsModal importantForAccessibility="yes" className="flex-1 justify-end">
        <SheetBackdrop onPress={close} />
        <SheetSurface
          translateY={translateY}
          header={{ title, onClose: close, onBack }}
          layout={layout}
          keyboardHeight={keyboardHeight}
          footer={footer}
        >
          {children}
        </SheetSurface>
        <ToastHost />
      </View>
    </Modal>
  );
}

/** Props de la surface animée d'une feuille. */
interface SheetSurfaceProps {
  readonly translateY: Animated.Value;
  readonly header: SheetHeaderContent;
  readonly layout: SheetLayout;
  readonly keyboardHeight: number;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

/** Titre, fermeture et retour éventuel de l'en-tête. */
interface SheetHeaderContent {
  readonly title: string;
  readonly onClose: () => void;
  readonly onBack: (() => void) | undefined;
}

/** Props de l'en-tête glissable d'une feuille. */
interface SheetHeaderProps {
  readonly header: SheetHeaderContent;
  readonly dragHandlers: GestureResponderHandlers;
}

/** Props d'un bouton rond de l'en-tête. */
interface HeaderIconButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly children: ReactNode;
}

/**
 * Bouton rond de l'en-tête : « Retour » ou « Fermer ».
 * @param props Libellé, action et icône.
 * @returns Le bouton.
 */
function HeaderIconButton(props: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      hitSlop={8}
      onPress={props.onPress}
      className="h-9 w-9 items-center justify-center rounded-full bg-field"
    >
      {props.children}
    </Pressable>
  );
}

/**
 * Rend la poignée, le titre et le bouton de fermeture de la feuille.
 * @param props Titre, fermeture, retour éventuel et gestionnaires du glissement.
 * @returns L'en-tête glissable.
 */
function SheetHeader(props: SheetHeaderProps) {
  const { title, onClose, onBack } = props.header;

  return (
    <View testID="bottom-sheet-header" {...props.dragHandlers}>
      <View className="mb-3 items-center">
        <View className="bg-ink/20" style={SHEET_HANDLE_SHAPE} />
      </View>
      <View className="mb-2 flex-row items-center justify-between gap-3">
        {onBack === undefined ? null : (
          <HeaderIconButton label="Retour" onPress={onBack}>
            <ChevronLeft size={20} color={PALETTE.muted} />
          </HeaderIconButton>
        )}
        <Text accessibilityRole="header" className="flex-1 text-[20px] font-bold text-ink">
          {title}
        </Text>
        <HeaderIconButton label="Fermer" onPress={onClose}>
          <X size={18} color={PALETTE.muted} />
        </HeaderIconButton>
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
  const { translateY, header, layout, keyboardHeight, children, footer } = props;
  const panHandlers = useSheetDrag(translateY, header.onClose);
  const scrollRef = useRef<ScrollViewInstance>(null);
  useFocusedFieldReveal(scrollRef, keyboardHeight);
  const contentLayout = {
    ...layout,
    minHeight: 0,
    paddingBottom: sheetContentPaddingBottom(layout),
  };

  return (
    <Animated.View
      testID="bottom-sheet"
      className="border-card-border"
      style={[SHADOWS.sheet, computeSheetCardStyle(contentLayout), { transform: [{ translateY }] }]}
    >
      <SheetHeader header={header} dragHandlers={panHandlers} />
      <ScrollView
        ref={scrollRef}
        testID="bottom-sheet-scroll"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={FOCUS_RING_SCROLL.scroll}
        contentContainerClassName="gap-4"
        contentContainerStyle={FOCUS_RING_SCROLL.content}
      >
        {children}
        {footer === undefined ? null : <View testID="bottom-sheet-footer">{footer}</View>}
      </ScrollView>
    </Animated.View>
  );
}

/** Ombre portée de la feuille, que Tailwind n'exprime pas côté natif. */
