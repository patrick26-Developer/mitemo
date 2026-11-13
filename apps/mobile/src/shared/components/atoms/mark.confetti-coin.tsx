import { View } from "react-native";

/**
 * Anneau intérieur d'une pièce, qui lui donne son relief.
 * @returns L'anneau, posé dans la pièce.
 */
export function ConfettiCoinMark() {
  return (
    <View
      testID="confetti-coin-mark"
      className="h-[64%] w-[64%] rounded-full border border-black/15 bg-white/25"
    />
  );
}
