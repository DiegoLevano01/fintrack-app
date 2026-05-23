import * as Sentry from "@sentry/react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppThemeProvider } from "./src/theme/ThemeContext";

Sentry.init({
  dsn: "https://46d71ccbcf3b9170c292d9dbd0f20c26@o4511431830470656.ingest.us.sentry.io/4511431830667264",

  sendDefaultPii: true,

  enableLogs: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  tracesSampleRate: 1.0,
});

function App() {
  return (
    <AppThemeProvider>
      <AppNavigator />
    </AppThemeProvider>
  );
}

export default Sentry.wrap(App);