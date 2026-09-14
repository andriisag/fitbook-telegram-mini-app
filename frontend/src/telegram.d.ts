interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }

  ready: () => void
  expand: () => void
  close: () => void
}

interface Telegram {
  WebApp: TelegramWebApp
}

interface Window {
  Telegram: Telegram
}