import { View } from "react-native";

/**
 * Marque d'un billet stylisé : un cadre clair et un médaillon au centre,
 * sans reprendre le dessin d'un vrai billet.
 * @returns La marque, posée dans le billet.
 */
export function ConfettiBillMark() {
  return (
    <View
      testID="confetti-bill-mark"
      className="h-[70%] w-[84%] items-center justify-center rounded-[2px] border border-white/50"
    >
      <View className="h-[60%] aspect-square rounded-full bg-white/45" />
    </View>
  );
}
