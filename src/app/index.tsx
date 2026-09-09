import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="h1 text-lingo-blue">MONOLINGO</Text>
      <Text>LANGUAGE LEARNING APP</Text>
      <Link href="/onboarding" asChild>
        <TouchableOpacity className="mt-lg rounded-lg bg-lingo-purple px-lg py-sm">
          <Text className="text-white font-poppins-semibold">Open Onboarding</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}