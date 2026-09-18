import type { ComponentProps } from "react";
import { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { Flag } from "@/components/flag";
import { images } from "@/constants/images";
import { getLanguageByCode } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { asHref } from "@/lib/auth-navigation";
import { colors, shadows } from "@/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const LIVE_FEEDBACK: { key: string; label: string; value: string; icon: IoniconName; color: string; progress: number }[] = [
  { key: "speaking", label: "Speaking", value: "Excellent", icon: "mic", color: colors.success, progress: 0.92 },
  { key: "pronunciation", label: "Pronunciation", value: "Great", icon: "volume-high", color: colors.lingoBlue, progress: 0.78 },
  { key: "grammar", label: "Grammar", value: "Good", icon: "book", color: colors.lingoPurple, progress: 0.65 },
];

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * AI Teacher audio lesson screen — matches prompt_material/07-audio-lesson-screen.png
 * (prompts/12-audio-lesson-ui.md). Audio-only: the camera tile and controls
 * below are visual placeholders, there's no real video/audio calling wired up
 * yet — that lands with Stream + Vision Agents (prompts/13, 14).
 */
export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);
  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [subtitlesOn, setSubtitlesOn] = useState(true);

  if (!lesson || !language) return <Redirect href="/learn" />;

  const teacherGreeting = `${capitalize(lesson.vocabulary[0]?.word ?? language.name)}! 👋 How's your day going?`;
  const userReply = lesson.phrases[0]?.phrase ?? lesson.goal;

  const endCall = () => (router.canGoBack() ? router.back() : router.replace(asHref("/")));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center px-lg pt-sm pb-sm">
        <TouchableOpacity onPress={endCall} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center gap-sm ml-sm">
          <Image source={images.mascotLogo} className="w-11 h-11 rounded-full" resizeMode="cover" />
          <View>
            <AppText variant="h4">Mono</AppText>
            <AppText variant="caption" className="text-text-secondary">
              Your AI Language Teacher
            </AppText>
            <View className="flex-row items-center gap-xs mt-0.5">
              <View className="w-1.5 h-1.5 rounded-full bg-success" />
              <AppText variant="caption" className="text-success">
                Online
              </AppText>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-sm">
          <IconCircle icon="videocam-outline" onPress={() => setCameraOn((value) => !value)} />
          <View className="items-center justify-center rounded-full bg-surface w-11 h-11">
            <AppText variant="bodySmall" className="font-bold">
              {lesson.xpReward}
            </AppText>
            <AppText variant="caption" className="text-text-secondary -mt-0.5">
              XP
            </AppText>
          </View>
          <IconCircle icon="notifications-outline" onPress={() => {}} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }} className="flex-1">
        {/* Teacher stage */}
        <View className="mx-lg rounded-[28px] overflow-hidden" style={[{ minHeight: 400 }, shadows.overlay]}>
          <LinearGradient colors={[`${colors.monoOrange}26`, `${colors.lingoPurple}26`]} style={{ flex: 1, padding: 16 }}>
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-center gap-xs rounded-full bg-white/90 px-sm py-1" style={shadows.card}>
                <Flag code={language.flagCode} />
                <AppText variant="caption" className="font-bold">
                  {lesson.title}
                </AppText>
              </View>

              {cameraOn && (
                <View className="items-center rounded-2xl overflow-hidden border-2 border-white w-20 h-24 bg-surface" style={shadows.raised}>
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="person-circle" size={48} color={colors.textSecondary} />
                  </View>
                  <View className="flex-row items-center justify-between w-full px-1 pb-1">
                    <AppText variant="caption" className="text-text-secondary">
                      You
                    </AppText>
                    <View className="w-1.5 h-1.5 rounded-full bg-success" />
                  </View>
                </View>
              )}
            </View>

            <View className="flex-1 items-center justify-center">
              <Image source={images.mascotLogo} className="w-40 h-40" resizeMode="contain" />
            </View>

            <View className="gap-sm">
              <View
                className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-md py-sm flex-row items-center gap-sm"
                style={shadows.card}
              >
                <AppText variant="bodyMedium" className="flex-1">
                  {teacherGreeting}
                </AppText>
                <Ionicons name="volume-high" size={18} color={colors.lingoPurple} />
              </View>

              <View className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-lingo-purple/15 px-md py-sm flex-row items-center gap-sm">
                <AppText variant="bodyMedium" className="flex-1">
                  {userReply}
                </AppText>
                <Ionicons name="pulse" size={18} color={colors.lingoPurple} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {subtitlesOn && (
          <AppText variant="bodySmall" className="text-text-secondary text-center mt-sm px-lg">
            {lesson.goal}
          </AppText>
        )}

        {/* Controls */}
        <View className="flex-row items-center justify-between px-xl mt-lg">
          <ControlButton
            icon={cameraOn ? "videocam" : "videocam-off"}
            label="Camera"
            active={cameraOn}
            onPress={() => setCameraOn((value) => !value)}
          />
          <ControlButton icon={micOn ? "mic" : "mic-off"} label="Mic" active={micOn} onPress={() => setMicOn((value) => !value)} />
          <ControlButton
            icon="language"
            label="Translate"
            active={subtitlesOn}
            onPress={() => setSubtitlesOn((value) => !value)}
          />
          <ControlButton icon="chatbubble-ellipses-outline" label="Chat" onPress={() => router.push("/chat")} />
          <ControlButton icon="call" label="End Call" danger onPress={endCall} />
        </View>

        {/* Live feedback */}
        <View className="rounded-2xl bg-white mx-lg mt-lg p-lg" style={shadows.card}>
          <View className="flex-row items-center justify-between">
            <AppText variant="h4">Live Feedback</AppText>
            <View className="flex-row items-center gap-xs">
              <AppText variant="bodySmall" className="text-lingo-purple">
                View Details
              </AppText>
              <Ionicons name="chevron-forward" size={14} color={colors.lingoPurple} />
            </View>
          </View>

          <View className="flex-row justify-between mt-md">
            {LIVE_FEEDBACK.map((item) => (
              <View key={item.key} className="items-center flex-1">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${item.color}1A` }}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <AppText variant="caption" className="text-text-secondary mt-sm">
                  {item.label}
                </AppText>
                <AppText variant="bodyMedium" className="font-bold mt-0.5" style={{ color: item.color }}>
                  {item.value}
                </AppText>
                <View className="h-1.5 w-full rounded-full bg-surface overflow-hidden mt-sm">
                  <View className="h-1.5 rounded-full" style={{ width: `${item.progress * 100}%`, backgroundColor: item.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function IconCircle({ icon, onPress }: { icon: IoniconName; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} className="w-11 h-11 rounded-full items-center justify-center bg-surface">
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

type ControlButtonProps = {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
};

function ControlButton({ icon, label, onPress, active = true, danger }: ControlButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="items-center gap-xs">
      <View
        className="w-14 h-14 rounded-full items-center justify-center"
        style={{ backgroundColor: danger ? colors.error : active ? colors.surface : colors.border }}
      >
        <Ionicons name={icon} size={22} color={danger ? "#fff" : active ? colors.textPrimary : colors.textSecondary} />
      </View>
      <AppText variant="caption" className="text-text-secondary">
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
