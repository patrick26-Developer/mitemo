import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Dimensions, Platform, ScrollView, StyleSheet, View } from "react-native";
import type { ScrollViewInstance } from "react-native";
import Animated, { Easing, SlideInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GridBackground } from "../../../shared/components/atoms/background.grid";
import { CornerDecor } from "../../../shared/components/atoms/decor.corner";
import { useFocusedFieldReveal } from "../../../shared/hooks/hook.focused-field-reveal";
import { useKeyboardHeight } from "../../../shared/hooks/hook.keyboard-height";
import type { SheetLayout } from "../../../shared/model/model.sheet-layout";
import { computeSheetLayout } from "../../../shared/model/model.sheet-layout";
import { FOCUS_RING_SCROLL } from "../../../shared/theme/theme.field";
import { SHEET_HANDLE_SHAPE, computeSheetCardStyle } from "../../../shared/theme/theme.sheet-card";
import { AUTH_COLORS } from "../model/model.auth-theme";
import { AuthLogo } from "./logo.auth";

/** Props de l'écran d'authentification. */
export interface AuthLayoutProps {
  readonly children: ReactNode;
}

/** Hauteur physique de l'écran, indépendante du clavier. */
const SCREEN_HEIGHT = Dimensions.get("screen").height;

/**
 * Pose le fond bleu quadrillé, le logo et la feuille blanche qui porte le
 * formulaire d'authentification. Le clavier ne déplace pas la carte : sa place
 * est réservée dans la carte, qui grandit vers le haut.
 * @param props Contenu de l'étape courante.
 * @returns L'écran d'authentification complet.
 */
export function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const sheetLayout = computeSheetLayout({
    platform: Platform.OS === "android" ? "android" : "ios",
    keyboardHeight,
    bottomInset: insets.bottom,
    screenHeight: SCREEN_HEIGHT,
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <GridBackground lineColor={AUTH_COLORS.gridLine} />
      <CornerDecor side="left" />
      <CornerDecor side="right" />
      <AuthLogoArea topInset={insets.top} />
      <AuthSheet layout={sheetLayout} keyboardHeight={keyboardHeight}>
        {children}
      </AuthSheet>
    </View>
  );
}

/** Props de la carte d'authentification. */
interface AuthSheetProps {
  readonly layout: SheetLayout;
  /** Hauteur du clavier, pour garder le champ en cours de saisie visible. */
  readonly keyboardHeight: number;
  readonly children: ReactNode;
}

/**
 * Rend la carte blanche, sa poignée et son contenu défilant.
 * @param props Dimensions calculées et contenu de l'étape.
 * @returns La carte ancrée en bas de l'écran.
 */
function AuthSheet(props: AuthSheetProps) {
  const { layout, keyboardHeight, children } = props;
  const scrollRef = useRef<ScrollViewInstance>(null);
  useFocusedFieldReveal(scrollRef, keyboardHeight);

  return (
    <Animated.View
      testID="auth-sheet"
      entering={SlideInDown.duration(550).easing(Easing.out(Easing.cubic))}
      style={[computeSheetCardStyle(layout), styles.sheetBorder]}
    >
      <View style={[SHEET_HANDLE_SHAPE, styles.handle]} />
      <ScrollView
        ref={scrollRef}
        testID="auth-scroll"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={FOCUS_RING_SCROLL.scroll}
        contentContainerStyle={[FOCUS_RING_SCROLL.content, styles.content]}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

/** Props de la zone du logo. */
interface AuthLogoAreaProps {
  readonly topInset: number;
}

/**
 * Affiche le logo centré sur le fond bleu, au-dessus de la carte.
 * @param props Marge haute de la zone sûre.
 * @returns Le logo centré.
 */
function AuthLogoArea(props: AuthLogoAreaProps) {
  const { topInset } = props;

  return (
    <View style={[styles.logoArea, { paddingTop: topInset }]}>
      <Animated.View entering={ZoomIn.duration(600)}>
        <AuthLogo />
      </Animated.View>
    </View>
  );
}

/** Styles du fond bleu et de la feuille ancrée en bas. */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AUTH_COLORS.background, justifyContent: "flex-end" },
  logoArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
  },
  sheetBorder: { borderColor: AUTH_COLORS.sheetBorder },
  handle: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    backgroundColor: AUTH_COLORS.handle,
  },
  content: { paddingTop: 12 + FOCUS_RING_SCROLL.content.padding },
});
