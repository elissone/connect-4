import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type SettingsProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type SettingsProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  boardDimensions: {col: number, row: number}
  setBoardDimensions: (dims: {col: number, row: number}) => void
  connectionLength: number
  setConnectionLength: (len: number) => void
}

const initialState: SettingsProviderState = {
  theme: "system",
  setTheme: () => null,
  boardDimensions: {col: 6, row: 6},
  setBoardDimensions: () => null,
  connectionLength: 4,
  setConnectionLength: () => null
}

const SettingsProviderContext = createContext<SettingsProviderState>(initialState)

export function SettingsProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: SettingsProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [boardDimensions, setBoardDimensions] = useState({ row: 6, col: 6 })
  const [connectionLength, setConnectionLength] = useState(4);

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    boardDimensions,
    setBoardDimensions,
    connectionLength,
    setConnectionLength
  }

  return (
    <SettingsProviderContext.Provider {...props} value={value}>
      {children}
    </SettingsProviderContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsProviderContext)

  if (context === undefined)
    throw new Error("useSettings must be used within a SettingsProvider")

  return context
}
