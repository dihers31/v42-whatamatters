"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { usePreForm } from "./pre-form-context"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { trackPreformSubmit } from "@/lib/analytics"
import type { Intent, PageSection } from "@/lib/analytics"

const STAGES = [
  { value: "exploring", label: { en: "Just exploring", es: "Solo explorando" } },
  { value: "ready", label: { en: "Ready to start soon", es: "Listo para comenzar" } },
  { value: "urgent", label: { en: "Need it urgently", es: "Lo necesito urgente" } },
]

const NEEDS = [
  { id: "web-design", label: { en: "Web Design & UX", es: "Diseño Web & UX" } },
  { id: "web-dev", label: { en: "Web Development", es: "Desarrollo Web" } },
  { id: "ai-strategy", label: { en: "AI & Digital Strategy", es: "IA & Estrategia Digital" } },
  { id: "seo", label: { en: "SEO & Lead Generation", es: "SEO & Generación de Leads" } },
  { id: "ecommerce", label: { en: "E-commerce Solutions", es: "Soluciones E-commerce" } },
  { id: "other", label: { en: "Other", es: "Otro" } },
]

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  stage: z.string().min(1, "Please select a project stage"),
  needs: z.array(z.string()).min(1, "Please select at least one service"),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
})

type FormData = z.infer<typeof formSchema>

export function PreFormModal() {
  const { isOpen, formType, language, closeForm } = usePreForm()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0)
  const COOLDOWN_MS = 10000 // 10 seconds

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    stage: "",
    needs: [] as string[],
    message: "",
    website: "",
  })

  useEffect(() => {
    const filledFields = [
      formData.fullName.trim(),
      formData.email.trim(),
      formData.company.trim(),
      formData.stage,
      formData.needs.length > 0,
    ].filter(Boolean).length

    setProgress((filledFields / 5) * 100)
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName =
        language === "en" ? "Name must be at least 2 characters" : "El nombre debe tener al menos 2 caracteres"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = language === "en" ? "Please enter a valid email address" : "Por favor ingresa un email válido"
    }

    if (!formData.company || formData.company.trim().length < 2) {
      newErrors.company = language === "en" ? "Company name is required" : "El nombre de la empresa es requerido"
    }

    if (!formData.stage) {
      newErrors.stage = language === "en" ? "Please select a project stage" : "Por favor selecciona una etapa"
    }

    if (formData.needs.length === 0) {
      newErrors.needs = language === "en" ? "Please select at least one service" : "Selecciona al menos un servicio"
    }

    return newErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleNeedsToggle = (needId: string) => {
    setFormData((prev) => {
      const isSelected = prev.needs.includes(needId)
      return {
        ...prev,
        needs: isSelected ? prev.needs.filter((id) => id !== needId) : [...prev.needs, needId],
      }
    })
    if (errors.needs) {
      setErrors((prev) => ({ ...prev, needs: "" }))
    }
  }

  const handleSubmit = async () => {
    console.log("🟢 PASO 1: handleSubmit iniciado")
    console.log("🟢 PASO 2: formData actual:", formData)

    if (formData.website && formData.website.trim() !== "") {
      console.log("🔴 SPAM detectado - formulario bloqueado")
      return
    }
    console.log("🟢 PASO 3: Honeypot OK")

    const newErrors: Record<string, string> = {}

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = language === "en" ? "Name is required" : "Nombre requerido"
    }

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = language === "en" ? "Valid email required" : "Email válido requerido"
    }

    if (!formData.company || formData.company.trim().length < 2) {
      newErrors.company = language === "en" ? "Company required" : "Empresa requerida"
    }

    if (!formData.stage) {
      newErrors.stage = language === "en" ? "Stage required" : "Etapa requerida"
    }

    if (formData.needs.length === 0) {
      newErrors.needs = language === "en" ? "Select at least one" : "Selecciona al menos uno"
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("🔴 PASO 4: Errores de validación:", newErrors)
      setErrors(newErrors)
      return
    }
    console.log("🟢 PASO 4: Validación OK")

    setIsSubmitting(true)
    console.log("🟢 PASO 5: Iniciando envío...")

    try {
      try {
        const page_section = sessionStorage.getItem("cta_section") || "unknown"
        const stageValue = formData.stage as "exploring" | "ready" | "urgent"
        trackPreformSubmit(formType as Intent, stageValue, page_section as PageSection, language, formData.needs)
        console.log("🟢 PASO 6: Analytics enviado")
      } catch (analyticsError) {
        console.warn("⚠️ Analytics falló (ignorado):", analyticsError)
      }

      console.log("🟢 PASO 7: Enviando a /api/send...")
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          company: formData.company,
          stage: formData.stage,
          needs: formData.needs,
          message: formData.message,
          formType: formType,
          user_language: language,
        }),
      })

      console.log("🟢 PASO 8: Respuesta recibida, status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("🔴 PASO 9: Error del servidor:", errorData)
        throw new Error(errorData.error || "Submission failed")
      }

      console.log("🟢 PASO 9: ¡Envío exitoso!")
      setIsSubmitted(true)

      setTimeout(() => {
        closeForm()
        resetForm()
      }, 3000)
    } catch (error) {
      console.error("🔴 Error en handleSubmit:", error)
      setErrors({
        submit: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
      console.log("🟢 PASO FINAL: handleSubmit terminado")
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      company: "",
      stage: "",
      needs: [],
      message: "",
      website: "",
    })
    setErrors({})
    setIsSubmitted(false)
    setProgress(0)
  }

  const content = {
    analyze: {
      en: {
        title: "Let's analyze your project",
        subtitle: "Tell us about your needs",
        success: "Thank you!",
        successMessage: "We'll get back to you within 24 hours.",
      },
      es: {
        title: "Analicemos tu proyecto",
        subtitle: "Cuéntanos tus necesidades",
        success: "¡Gracias!",
        successMessage: "Te responderemos en 24 horas.",
      },
    },
    conversation: {
      en: {
        title: "Let's start a conversation",
        subtitle: "Tell us about your needs",
        success: "Thank you!",
        successMessage: "We'll get back to you within 24 hours.",
      },
      es: {
        title: "Conversemos",
        subtitle: "Cuéntanos tus necesidades",
        success: "¡Gracias!",
        successMessage: "Te responderemos en 24 horas.",
      },
    },
  }

  const lang = content[formType][language]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeForm}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111111] border border-[#333333] rounded-lg w-full max-w-2xl mt-8 mb-8 overflow-x-hidden overflow-y-auto max-h-[85vh]"

            style={{ willChange: "opacity" }}
          >
            {/* PROGRESS BAR */}
            <div className="h-1 bg-[#333333]">
              <motion.div
                className="h-full bg-[#0066FF]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* CONTENT */}
            {isSubmitted ? (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang.success}
                </h3>
                <p className="text-[#999999]">
                  {lang.successMessage}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
                className="p-6 space-y-6"
              >
                {/* HEADER */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {lang.title}
                  </h2>
                  <p className="text-[#999999]">
                    {lang.subtitle}
                  </p>
                </div>

                {/* FULL NAME */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                    {language === "en" ? "Full Name" : "Nombre Completo"}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#0066FF] transition-colors"
                    placeholder={language === "en" ? "John Doe" : "Juan Pérez"}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    {language === "en" ? "Email" : "Correo Electrónico"}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#0066FF] transition-colors"
                    placeholder={language === "en" ? "john@company.com" : "juan@empresa.com"}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* COMPANY */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                    {language === "en" ? "Company" : "Empresa"}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#0066FF] transition-colors"
                    placeholder={language === "en" ? "Your Company" : "Tu Empresa"}
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.company}
                    </p>
                  )}
                </div>

                {/* PROJECT STAGE */}
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-white mb-2">
                    {language === "en" ? "Project Stage" : "Etapa del Proyecto"}
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#0066FF] transition-colors"
                  >
                    <option value="">
                      {language === "en" ? "Select a stage" : "Selecciona una etapa"}
                    </option>
                    {STAGES.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label[language]}
                      </option>
                    ))}
                  </select>
                  {errors.stage && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.stage}
                    </p>
                  )}
                </div>

                {/* SERVICES NEEDED */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {language === "en" ? "What do you need?" : "¿Qué necesitas?"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {NEEDS.map((need) => (
                      <button
                        key={need.id}
                        type="button"
                        onClick={() => handleNeedsToggle(need.id)}
                        className={`px-4 py-3 rounded-lg border transition-all ${formData.needs.includes(need.id)
                            ? "bg-[#0066FF] border-[#0066FF] text-white"
                            : "bg-[#1a1a1a] border-[#333333] text-[#999999] hover:border-[#0066FF]"
                          }`}
                      >
                        {need.label[language]}
                      </button>
                    ))}
                  </div>
                  {errors.needs && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.needs}
                    </p>
                  )}
                </div>

                {/* MESSAGE (OPTIONAL) */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    {language === "en" ? "Message (Optional)" : "Mensaje (Opcional)"}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
                    placeholder={language === "en" ? "Tell us more about your project..." : "Cuéntanos más sobre tu proyecto..."}
                  />
                </div>

                {/* HONEYPOT (ANTI-SPAM) - HIDDEN FIELD */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === "en" ? "Sending..." : "Enviando..."}
                    </span>
                  ) : (
                    language === "en" ? "Send Message" : "Enviar Mensaje"
                  )}
                </Button>

                {/* ERROR GENERAL */}
                {errors.submit && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}