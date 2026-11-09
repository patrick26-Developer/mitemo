import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { Easing, SlideInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GridBackground } from "../../../shared/components/grid-background";
import { AUTH_COLORS } from "../model/auth-theme";
import { AuthCornerDecor } from "./auth-corner-decor";
import { AuthLogo } from "./auth-logo";

/** Props de l'écran d'authentification. */
export interface AuthLayoutProps {
  readonly children: ReactNode;
}

/** Marge basse ajoutée à la zone sûre, en points. */
const SHEET_BOTTOM_PADDING = 20;

/**
 * Pose le fond bleu quadrillé, le logo et la feuille blanche qui porte le
 * formulaire d'authentification.
 * @param props Contenu de l'étape courante.
 * @returns L'écran d'authentification complet.
 */
export function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <GridBackground lineColor={AUTH_COLORS.gridLine} />
      <AuthCornerDecor side="left" />
      <AuthCornerDecor side="right" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.logoArea, { paddingTop: insets.top }]}>
          <Animated.View entering={ZoomIn.duration(600)}>
            <AuthLogo />
          </Animated.View>
        </View>
        <Animated.View
          testID="auth-sheet"
          entering={SlideInDown.duration(550).easing(Easing.out(Easing.cubic))}
          style={[styles.sheet, { paddingBottom: insets.bottom + SHEET_BOTTOM_PADDING }]}
        >
          <View style={styles.handle} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

/** Styles du fond bleu et de la feuille ancrée en bas. */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AUTH_COLORS.background },
  logoArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  sheet: {
    maxHeight: "88%",
    flexShrink: 1,
    backgroundColor: AUTH_COLORS.sheet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: AUTH_COLORS.sheetBorder,
    paddingHorizontal: 20,
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
  content: { paddingTop: 18, paddingBottom: 4 },
});
