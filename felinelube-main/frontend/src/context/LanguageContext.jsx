import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en')

  const t = (path) => {
    const keys = path.split('.')
    let result = translations[lang]
    for (const key of keys) {
      if (result[key]) {
        result = result[key]
      } else {
        return path // Fallback to path if not found
      }
    }
    return result
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
