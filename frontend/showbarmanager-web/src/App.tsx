import { useEffect, useState } from "react"
import { AppRoutes } from "./routes/AppRoutes"
import { useAuthStore } from "./store/auth.store"
import { useLanguageStore } from "./store/language.store"
import { useThemeStore } from "./store/theme.store"

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession)
  const restoreLanguage = useLanguageStore((state) => state.restoreLanguage)
  const restoreTheme = useThemeStore((state) => state.restoreTheme)

  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    restoreSession()
    restoreLanguage()
    restoreTheme()
    setAppReady(true)
  }, [restoreSession, restoreLanguage, restoreTheme])

  if (!appReady) {
    return null
  }

  return <AppRoutes />
}

export default App