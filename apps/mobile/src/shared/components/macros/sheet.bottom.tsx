import { X } from "lucide-react-native";
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
import { useModalPresence } from "../../hooks/hook.modal-presence";
import { useSheetDrag } from "../../hooks/hook.sheet-drag";
import type { SheetLayout } from "../../model/model.sheet-layout";
import { computeSheetLayout, sheetContentPaddingBottom } from "../../model/model.sheet-layout";
import { FOCUS_RING_SCROLL } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";
import { SHADOWS } from "../../theme/theme.shadow";
import { SHEET_HANDLE_SHAPE, computeSheetCardStyle } from "../../theme/theme.sheet-card";
import { SHEET_OPEN_OFFSET, closeSheet, openSheet } from "../../model/model.sheet-animation";
import { SheetBackdrop } from "../atoms/backdrop.sheet";
import type { StepIndicatorProps } from "../atoms/indicator.step";
import { StepIndicator } from "../atoms/indicator.step";
import { ConnectionHost } from "./host.connection";
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
   * Étapes d'un formulaire, posées dans l'en-tête à la place de la croix : la
   * feuille se ferme alors en la glissant vers le bas ou en touchant le fond.
   */
  readonly steps?: StepIndicatorProps;
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
 * Présence de la feuille : sa visibilité réelle, retenue sur iOS tant que la
 * fermeture précédente n'est pas finie, et sa montée à chaque ouverture.
 * @param requested Visibilité demandée par le propriétaire.
 * @returns La translation, la visibilité à appliquer et la fin de fermeture.
 */
function useSheetPresence(requested: boolean) {
  const [translateY] = useState(() => new Animated.Value(SHEET_OPEN_OFFSET));
  const { shown: visible, onDismiss } = useModalPresence(requested);
  useEffect(() => {
    if (!visible) {
      translateY.setValue(SHEET_OPEN_OFFSET);
      return;
    }

    openSheet(translateY);
  }, [visible, translateY]);

  return { translateY, visible, onDismiss };
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
  const { title, onClose, children, footer, steps } = props;
  const { keyboardHeight, layout } = useSheetLayout();
  const { translateY, visible, onDismiss } = useSheetPresence(props.visible);
  const close = useStableClose(translateY, onClose);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
      onDismiss={onDismiss}
    >
      <View accessibilityViewIsModal importantForAccessibility="yes" className="flex-1 justify-end">
        <SheetBackdrop onPress={close} />
        <SheetSurface
          translateY={translateY}
          header={{ title, onClose: close, steps }}
          layout={layout}
          keyboardHeight={keyboardHeight}
          footer={footer}
        >
          {children}
        </SheetSurface>
        <ToastHost />
        <ConnectionHost />
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

/** Titre, étapes éventuelles et fermeture de l'en-tête. */
interface SheetHeaderContent {
  readonly title: string;
  readonly onClose: () => void;
  readonly steps: StepIndicatorProps | undefined;
}

/** Props de l'en-tête glissable d'une feuille. */
interface SheetHeaderProps {
  readonly header: SheetHeaderContent;
  readonly dragHandlers: GestureResponderHandlers;
}

/**
 * Rend la poignée, le titre et le bouton de fermeture de la feuille.
 * @param props Titre, étapes, fermeture et gestionnaires du glissement.
 * @returns L'en-tête glissable.
 */
function SheetHeader(props: SheetHeaderProps) {
  const { title, onClose, steps } = props.header;

  return (
    <View testID="bottom-sheet-header" {...props.dragHandlers}>
      <View className="mb-3 items-center">
        <View className="bg-ink/20" style={SHEET_HANDLE_SHAPE} />
      </View>
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="flex-1 text-[20px] font-bold text-ink"
        >
          {title}
        </Text>
        {steps === undefined ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer"
            hitSlop={8}
            onPress={onClose}
            className="h-9 w-9 items-center justify-center rounded-full bg-field"
          >
            <X size={18} color={PALETTE.muted} />
          </Pressable>
        ) : (
          <StepIndicator {...steps} />
        )}
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
