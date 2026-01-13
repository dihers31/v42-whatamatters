"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type FormType = "analyze" | "conversation"

interface PreFormContextType {
  isOpen: boolean
  formType: FormType
  step: number
  language: "en" | "es"
  openForm: (type: FormType) => void
  closeForm: () => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
  setLanguage: (lang: "en" | "es") => void
}

const PreFormContext = createContext<PreFormContextType | undefined>(undefined)

export function PreFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formType, setFormType] = useState<FormType>("analyze")
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState<"en" | "es">("en")

  const openForm = (type: FormType) => {
    setFormType(type)
    setIsOpen(true)
    setStep(1)
  }

  const closeForm = () => {
    setIsOpen(false)
    setTimeout(() => setStep(1), 300)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const resetForm = () => {
    setStep(1)
  }

  return (
    <PreFormContext.Provider
      value={{
        isOpen,
        formType,
        step,
        language,
        openForm,
        closeForm,
        nextStep,
        prevStep,
        resetForm,
        setLanguage,
      }}
    >
      {children}
    </PreFormContext.Provider>
  )
}

export function usePreForm() {
  const context = useContext(PreFormContext)
  if (context === undefined) {
    throw new Error("usePreForm must be used within a PreFormProvider")
  }
  return context
}
