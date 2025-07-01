import { View } from "react-native";
import { ReactNode } from "react";

export function PaddingView({ children }: { children: ReactNode }) {
  return(
    <View className="p-4">
      {children}
    </View>
  );
}