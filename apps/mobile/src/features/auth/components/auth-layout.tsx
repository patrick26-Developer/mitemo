import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { Dimensions, Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { Easing, SlideInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GridBackground } from "../../../shared/components/grid-background";
import { useKeyboardHeight } from "../../../shared/hooks/use-keyboard-height";
import { AUTH_COLORS } from "../model/auth-theme";
import type { AuthSheetLayout } from "../model/auth-sheet-layout";
import { computeAuthSheetLayout } from "../model/auth-sheet-layout";
import { AuthCornerDecor } from "./auth-corner-decor";
import { AuthLogo } from "./auth-logo";

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
  const sheetLayout = computeAuthSheetLayout({
    platform: Platform.OS === "android" ? "android" : "ios",
    keyboardHeight,
    bottomInset: insets.bottom,
    screenHeight: SCREEN_HEIGHT,
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <GridBackground lineColor={AUTH_COLORS.gridLine} />
      <AuthCornerDecor side="left" />
      <AuthCornerDecor side="right" />
      <AuthLogoArea topInset={insets.top} />
      <AuthSheet layout={sheetLayout}>{children}</AuthSheet>
    </View>
  );
}

/** Props de la carte d'authentification. */
interface AuthSheetProps {
  readonly layout: AuthSheetLayout;
  readonly children: ReactNode;
}

/**
 * Rend la carte blanche, sa poignée et son contenu défilant.
 * @param props Dimensions calculées et contenu de l'étape.
 * @returns La carte ancrée en bas de l'écran.
 */
function AuthSheet(props: AuthSheetProps) {
  const { layout, children } = props;

  return (
    <Animated.View
      testID="auth-sheet"
      entering={SlideInDown.duration(550).easing(Easing.out(Easing.cubic))}
      style={[
        styles.sheet,
        {
          maxHeight: layout.maxHeight,
          paddingBottom: layout.paddingBottom,
          marginBottom: layout.marginBottom,
        },
      ]}
    >
      <View style={styles.handle} />
      <ScrollView
        testID="auth-scroll"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
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
  sheet: {
    flexShrink: 1,
    backgroundColor: AUTH_COLORS.sheet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 48,
    borderBottomLeftRadius: 48,
    borderTopWidth: 1,
    borderColor: AUTH_COLORS.sheetBorder,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    paddingTop: 14,
  },
  handle: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    width: 42,
    height: 3,
    borderRadius: 2,
    backgroundColor: AUTH_COLORS.handle,
  },
  content: { paddingTop: 12 },
});
