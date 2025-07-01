import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function MercadoPagoScreen() {
  const { mpUrl } = useLocalSearchParams();
  const router = useRouter();

  const handleNavChange = (navState: import('react-native-webview').WebViewNavigation) => {
    const url = navState.url;

    if (url.includes('/success')) {
  router.replace('/success');
} else if (url.includes('/failure')) {
  router.replace('/failure');
} else if (url.includes('/pending')) {
  router.replace('/pending');
}
  };

  return (
    <WebView
      source={{ uri: mpUrl as string }}
      onNavigationStateChange={handleNavChange}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  );
}
