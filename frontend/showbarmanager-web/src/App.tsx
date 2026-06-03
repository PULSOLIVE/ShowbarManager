import { useEffect } from "react"
import { AppRoutes } from "./routes/AppRoutes"
import { useAuthStore } from "./store/auth.store"
import { useLanguageStore } from "./store/language.store"
import { useThemeStore } from "./store/theme.store"

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession)
  const restoreLanguage = useLanguageStore((state) => state.restoreLanguage)
  const restoreTheme = useThemeStore((state) => state.restoreTheme)

  useEffect(() => {
    restoreSession()
    restoreLanguage()
    restoreTheme()
  }, [restoreSession, restoreLanguage, restoreTheme])

  return <AppRoutes />
}

export default App