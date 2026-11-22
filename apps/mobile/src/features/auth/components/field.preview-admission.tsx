import { useState } from "react";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { PreviewAdmissionForm } from "./form.preview-admission";

/**
 * Admission testeur séparée du PIN, sans secret intégré au bundle.
 * @returns La saisie masquée du laissez-passer signé.
 */
export function PreviewAdmissionField() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Accès testeur Preview"
        onPress={() => setOpen(true)}
        style={{ position: "absolute", top: insets.top + 8, right: 16 }}
      >
        <Text className="text-white underline">Accès testeur</Text>
      </Pressable>
      <BottomSheet visible={open} title="Accès testeur Preview" onClose={() => setOpen(false)}>
        <PreviewAdmissionForm />
      </BottomSheet>
    </>
  );
}
