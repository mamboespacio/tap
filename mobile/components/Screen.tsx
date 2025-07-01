import { View } from "react-native";

import { ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}