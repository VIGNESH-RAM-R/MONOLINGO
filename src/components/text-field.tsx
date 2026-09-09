import { type ComponentProps, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/app-text";
import { colors, shadows } from "@/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type TextFieldProps = {
  icon: IoniconName;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Renders the field as a password box with a show/hide toggle. */
  secureTextEntry?: boolean;
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
  autoCapitalize?: ComponentProps<typeof TextInput>["autoCapitalize"];
  autoCorrect?: ComponentProps<typeof TextInput>["autoCorrect"];
};

/**
 * Auth text field matching prompt_material/03-auth-screen.png — a leading
 * icon, a small label sitting above the value, and (for passwords) a
 * trailing show/hide toggle.
 *
 * `shadows.card` is a StyleSheet-exception import per AGENTS.md (platform
 * shadow syntax differs), the rest stays className.
 */
export function TextField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  autoCorrect,
}: TextFieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View
      className="flex-row items-center gap-sm rounded-xl border border-border bg-white px-md py-sm"
      style={shadows.card}
    >
      <Ionicons name={icon} size={20} color={colors.textSecondary} />

      <View className="flex-1">
        <AppText variant="caption" className="text-text-secondary">
          {label}
        </AppText>
        <TextInput
          className="p-0 text-text-primary font-poppins-medium text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.border}
          secureTextEntry={secureTextEntry && !revealed}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          // Dynamic style per AGENTS.md's TextInput exception — zeroes out
          // the platform's default vertical padding so the box height
          // matches the design instead of growing with the native default.
          style={{ paddingVertical: 0 }}
        />
      </View>

      {secureTextEntry && (
        <TouchableOpacity onPress={() => setRevealed((v) => !v)} hitSlop={8}>
          <Ionicons name={revealed ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
