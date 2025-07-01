import { Link } from "expo-router";
import { Pressable, View, Text } from "react-native";

interface LinkedButtonProps {
  href: string;
  text: string;
  color?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderColor?: string;
}

export default function LinkedButton({ href, text, color, textAlign, textColor, borderColor }: LinkedButtonProps) {
  // Map textAlign prop to alignItems values for React Native
  const alignItemsMap: Record<'left' | 'center' | 'right', 'flex-start' | 'center' | 'flex-end'> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };
  return (
    <Link href={href as any} asChild>
      <Pressable className="active:opacity-70">
        <View
          style={{
            backgroundColor: color || 'transparent',
            borderColor: borderColor || 'transparent',
            borderWidth: borderColor ? 1 : 0,
            padding: 10,
            borderRadius: 50,
            alignItems: alignItemsMap[textAlign || 'center'],
          }}>
          <Text style={{ color:textColor || 'black' }}>
            {text}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}