"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePreForm } from "@/components/pre-form-context"
import { PreFormModal } from "@/components/pre-form-modal"
import { trackCTAClick } from "@/lib/analytics"
import type { CTALabel, PageSection } from "@/lib/analytics"

const translations = {
  en: {
    nav: {
      whatWeDo: "What we do",
      work: "Work",
      thinking: "Thinking",
      about: "About",
      contact: "Contact",
      letsTalk: "Start a Conversation",
    },
    hero: {
      sequence: ["Hello", "We are", "Delivering firsts", "We do what matters: connection."],
      headline: "We do what matters: connection.",
      subheadline:
        "We design and build digital experiences that connect ideas, people, and decisions to create real impact.",
      cta: "Analyze My Project",
      scroll: "Scroll to explore",
    },
    belief: {
      title: "We believe",
      text1: "We connect strategy, design, and technology to build digital experiences that matter and perform.",
      text2: "We don't design for looks.\nWe don't build for trends.",
      text3: "We design to connect. We build to impact.",
    },
    services: {
      title: "What we do",
      subtitle: "We deliver end-to-end solutions that connect brand, message, and conversion.",
      items: [
        {
          number: "01",
          title: "Web Design Focused on Conversion",
          description: "We design websites that connect brand identity with user action and measurable results.",
          icon: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "02",
          title: "Web Development",
          description: "We build fast, scalable, and accessible digital systems using modern technology.",
          icon: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "03",
          title: "Digital Strategy & AI",
          description: "We apply AI and strategic thinking to solve real business problems and optimize performance.",
          icon: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "04",
          title: "UX Optimization & CRO",
          description: "We optimize user experiences to increase conversion rates and reduce friction.",
          icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "05",
          title: "SEO & Lead Generation",
          description: "We connect your brand with qualified audiences through organic search and targeted campaigns.",
          icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80",
        },
      ],
    },
    work: {
      title: "Work",
      subtitle: "Selected projects.\nReal connections between design, technology, and results.",
      filters: ["All", "Web", "E-commerce", "Logistics", "Sport", "Medical"],
      viewAll: "View all projects",
    },
    results: {
      title: "Results that matter.",
      metrics: [
        { value: "+35%", label: "Average conversion rate" },
        { value: "+42%", label: "Lead generation increase" },
        { value: "-38%", label: "Bounce rate reduction" },
        { value: "+2.4x", label: "Estimated ROI in digital campaigns" },
      ],
    },
    about: {
      text1: "Whatamatters exists to connect what truly matters.",
      text2: "No noise. Just focus.",
      text3:
        "Every project is a deliberate connection between strategy, design, and technology around a clear, measurable objective.",
      cta: "More about us",
    },
    thinking: {
      title: "Thinking",
      subtitle: "We think to connect. We design to impact.",
      cta: "Explore thinking",
    },
    careers: {
      text: "We look for bold thinkers and skilled makers who elevate the work and craft exceptional experiences.",
      cta: "See job openings",
    },
    finalCta: {
      title: "Ready to connect what matters?",
      subtitle: "Start a conversation and create real impact.",
      cta: "Analyze My Project",
    },
    footer: {
      letsTalk: "Start a conversation",
      chat: "Chat",
      withUs: "With Us",
      channels: ["Newsletter", "LinkedIn", "Instagram", "Twitter"],
      legalities: ["Privacy", "Accessibility", "Legal"],
      contact: ["Become a Client", "Press Inquiries", "Careers", "Everything Else"],
      headquarters: ["Bethesda, MD", "Miami, FL"],
      copyright: "© 2025 Whatamatters. All rights reserved",
      backToTop: "Back to top",
    },
    contactForm: {
      title: "Ready to connect what matters?",
      subtitle: "Let's build something that creates real impact.",
      email: "business@whatamatters.com",
      phone: "+1 (240) 555-0199",
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      projectTypeLabel: "Project Type",
      projectTypes: [
        "Web Design",
        "Web Development",
        "AI Strategy",
        "SEO & Lead Generation",
        "UX Optimization",
        "Other",
      ],
      messagePlaceholder: "Tell us about your project...",
      submitButton: "Send Message",
      messageSent: "Message Sent!",
      messageSentSubtitle: "We'll get back to you within 24 hours.",
    },
  },
  es: {
    nav: {
      whatWeDo: "Qué hacemos",
      work: "Trabajo",
      thinking: "Pensamos",
      about: "Nosotros",
      contact: "Contacto",
      letsTalk: "Inicia una Conversación",
    },
    hero: {
      sequence: ["Hola", "Somos", "Entregamos primeros", "Hacemos lo que importa: conexión."],
      headline: "Hacemos lo que importa: conexión.",
      subheadline:
        "Diseñamos y construimos experiencias digitales que conectan ideas, personas y decisiones para crear impacto real.",
      cta: "Analiza Mi Proyecto",
      scroll: "Desplázate para explorar",
    },
    belief: {
      title: "Creemos",
      text1:
        "Conectamos estrategia, diseño y tecnología para construir experiencias digitales que importan y funcionan.",
      text2: "No diseñamos por estética.\nNo construimos por tendencias.",
      text3: "Diseñamos para conectar. Construimos para impactar.",
    },
    services: {
      title: "Qué hacemos",
      subtitle: "Entregamos soluciones completas que conectan marca, mensaje y conversión.",
      items: [
        {
          number: "01",
          title: "Diseño Web Enfocado en Conversión",
          description:
            "Diseñamos sitios web que conectan la identidad de marca con la acción del usuario y resultados medibles.",
          icon: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "02",
          title: "Desarrollo Web",
          description: "Construimos sistemas digitales rápidos, escalables y accesibles usando tecnología moderna.",
          icon: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "03",
          title: "Estrategia Digital e IA",
          description:
            "Aplicamos IA y pensamiento estratégico para resolver problemas de negocio reales y optimizar el rendimiento.",
          icon: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "04",
          title: "Optimización UX y CRO",
          description: "Optimizamos experiencias de usuario para aumentar tasas de conversión y reducir fricción.",
          icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80",
        },
        {
          number: "05",
          title: "SEO y Generación de Leads",
          description:
            "Conectamos tu marca con audiencias calificadas a través de búsqueda orgánica y campañas dirigidas.",
          icon: " https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80",
        },
      ],
    },
    work: {
      title: "Trabajo",
      subtitle: "Proyectos seleccionados.\nConexiones reales entre diseño, tecnología y resultados.",
      filters: ["Todos", "Web", "E-commerce", "Logística", "Deporte", "Médico"],
      viewAll: "Ver todos los proyectos",
    },
    results: {
      title: "Resultados que importan.",
      metrics: [
        { value: "+35%", label: "Tasa de conversión promedio" },
        { value: "+42%", label: "Aumento en generación de leads" },
        { value: "-38%", label: "Reducción de tasa de rebote" },
        { value: "+2.4x", label: "ROI estimado en campañas digitales" },
      ],
    },
    about: {
      text1: "Whatamatters existe para conectar lo que realmente importa.",
      text2: "Sin ruido. Solo enfoque.",
      text3:
        "Cada proyecto es una conexión deliberada entre estrategia, diseño y tecnología en torno a un objetivo claro y medible.",
      cta: "Más sobre nosotros",
    },
    thinking: {
      title: "Pensamiento",
      subtitle: "Pensamos para conectar. Diseñamos para impactar.",
      cta: "Explorar pensamiento",
    },
    careers: {
      text: "Buscamos pensadores audaces y creadores hábiles que eleveen el trabajo y creen experiencias excepcionales.",
      cta: "Ver ofertas de trabajo",
    },
    finalCta: {
      title: "¿Listo para conectar lo que importa?",
      subtitle: "Inicia una conversación y crea un impacto real.",
      cta: "Analiza Mi Proyecto",
    },
    footer: {
      letsTalk: "Inicia una conversación",
      chat: "Chat",
      withUs: "Con Nosotros",
      channels: ["Newsletter", "LinkedIn", "Instagram", "Twitter"],
      legalities: ["Privacidad", "Accesibilidad", "Legal"],
      contact: ["Conviértete en Cliente", "Consultas de Prensa", "Carreras", "Todo lo Demás"],
      headquarters: ["Bethesda, MD", "Miami, FL"],
      copyright: "© 2025 Whatamatters. Todos los derechos reservados",
      backToTop: "Volver arriba",
    },
    contactForm: {
      title: "¿Listo para conectar lo que importa?",
      subtitle: "Construyamos algo que cree un impacto real.",
      email: "business@whatamatters.com",
      phone: "+1 (240) 555-0199",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Tu email",
      projectTypeLabel: "Tipo de Proyecto",
      projectTypes: [
        "Diseño Web",
        "Desarrollo Web",
        "Estrategia IA",
        "SEO y Generación de Leads",
        "Optimización UX",
        "Otro",
      ],
      messagePlaceholder: "Cuéntanos sobre tu proyecto...",
      submitButton: "Enviar Mensaje",
      messageSent: "¡Mensaje Enviado!",
      messageSentSubtitle: "Te responderemos en 24 horas.",
    },
  },
}

const projects = [
  {
    client: "Buugolf",
    category: "Golf / Coaching",
    description: "Connecting personal authority with student acquisition.",
    tag: "Sport",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop",
  },
  {
    client: "10M Logistic",
    category: "Logistics / Startup",
    description: "Connecting B2B proposition with trust and conversion.",
    tag: "Logistics",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
  },
  {
    client: "GVRitual",
    category: "Fashion / E-commerce",
    description: "Connecting brand storytelling with e-commerce sales in USA.",
    tag: "E-commerce",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop",
  },
  {
    client: "Aurora MedSpa Montgomery",
    category: "Medical / SPA",
    description: "Connecting trust, services, and online bookings.",
    tag: "Medical",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
  },
  {
    client: "TechFlow Solutions",
    category: "Technology / Startup",
    description: "Connecting innovation with market-ready solutions.",
    tag: "Web",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
  },
  {
    client: "Wellness Clinic Plus",
    category: "Healthcare / Clinic",
    description: "Connecting patient care with digital accessibility.",
    tag: "Medical",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
  },
  {
    client: "Urban Dining Group",
    category: "Restaurant / Hospitality",
    description: "Connecting culinary excellence with digital reservations.",
    tag: "Web",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    client: "FitPro Athletics",
    category: "Fitness / Sport",
    description: "Connecting fitness goals with community engagement.",
    tag: "Sport",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  },
]

const articles = [
  { category: "Design", title: "Design that connects, not just looks good" },
  { category: "Experience", title: "Clear, fast, and human websites" },
  { category: "AI → Strategy", title: "AI applied to real business problems" },
  { category: "Development", title: "Building scalable systems that last" },
  { category: "Performance", title: "Speed as a feature, not an afterthought" },
]

// Rename component to Page and use the hook
export default function Page() {
  const [lang, setLang] = useState("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [heroSequenceIndex, setHeroSequenceIndex] = useState(0)
  const [heroSequenceComplete, setHeroSequenceComplete] = useState(false)
  const [currentBgImage, setCurrentBgImage] = useState(0)
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [workFilter, setWorkFilter] = useState("All")
  const [showContactModal, setShowContactModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false) // Declare showFloatingButton
  const { openForm } = usePreForm()

  const lastScrollY = useRef(0)
  const careersRef = useRef(null)
  const contactRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  const t = translations[lang]

  const heroImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop",
  ]

  // Hero text animation sequence
  useEffect(() => {
    if (heroSequenceIndex < t.hero.sequence.length - 1) {
      const timer = setTimeout(
        () => {
          setHeroSequenceIndex((prev) => prev + 1)
        },
        heroSequenceIndex === 2 ? 2000 : 1000,
      )
      return () => clearTimeout(timer)
    } else {
      setHeroSequenceComplete(true)
    }
  }, [heroSequenceIndex, t.hero.sequence.length])

  // Background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Navbar scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }

      setShowFloatingButton(currentScrollY > 300)

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parallax effect for careers section
  const careersY = useTransform(scrollY, [0, 1000], [0, -200])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleOpenPreForm = (type: "analyze" | "conversation", section: PageSection, ctaLabel: CTALabel) => {
    // Store tracking context in sessionStorage for form submission
    sessionStorage.setItem("cta_section", section)
    sessionStorage.setItem("cta_label", ctaLabel)

    // Track CTA click event in GA4
    trackCTAClick(ctaLabel, section, lang as "en" | "es")

    openForm(type)
  }

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredProjects =
    workFilter === "All" || workFilter === "Todos" ? projects : projects.filter((p) => p.tag === workFilter)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
      setFormData({ name: "", email: "", projectType: "", message: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <PreFormModal />

      {/* Navigation - FIXED: z-index increased to 100 */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: navbarVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-sm border-b border-[#333333]"
      >
        <nav className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="text-xl font-medium">Whatamatters</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#what-we-do" className="text-sm hover:text-[#0066FF] transition-colors">
              {t.nav.whatWeDo}
            </a>
            <a href="#work" className="text-sm hover:text-[#0066FF] transition-colors">
              {t.nav.work}
            </a>
            <a href="#thinking" className="text-sm hover:text-[#0066FF] transition-colors">
              {t.nav.thinking}
            </a>
            <a href="#about" className="text-sm hover:text-[#0066FF] transition-colors">
              {t.nav.about}
            </a>
            <a href="#contact" className="text-sm hover:text-[#0066FF] transition-colors">
              {t.nav.contact}
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setLang("en")}
                className={`${lang === "en" ? "underline" : "text-[#999999]"} hover:text-white transition-colors`}
              >
                EN
              </button>
              <span className="text-[#999999]">|</span>
              <button
                onClick={() => setLang("es")}
                className={`${lang === "es" ? "underline" : "text-[#999999]"} hover:text-white transition-colors`}
              >
                ES
              </button>
            </div>

            <Button
              variant="outline"
              className="hidden md:inline-flex border-[#0066FF] text-white hover:bg-[#0066FF] hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all duration-200 bg-transparent"
              onClick={() => handleOpenPreForm("conversation", "navbar", "nav_start_conversation")}
            >
              {t.nav.letsTalk}
            </Button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed inset-0 bg-black z-40 md:hidden pt-20 px-6"
            >
              <div className="flex flex-col gap-6 text-2xl">
                <a href="#what-we-do" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.whatWeDo}
                </a>
                <a href="#work" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.work}
                </a>
                <a href="#thinking" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.thinking}
                </a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.about}
                </a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.contact}
                </a>
                <Button
                  className="bg-[#0066FF] text-white mt-4 w-full"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleOpenPreForm("conversation", "Mobile Menu", "nav_start_conversation_mobile")
                  }}
                >
                  {t.nav.letsTalk}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Section 1: Hero - FIXED: Added padding-top for fixed header */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentBgImage ? 0.3 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img src={url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        </div>

        {/* Hero Content - FIXED: Improved CTA button spacing */}
        <div className="relative z-20 text-center px-6 max-w-5xl">
          {!heroSequenceComplete && (
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroSequenceIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-6xl md:text-8xl font-black mb-8"
              >
                {t.hero.sequence[heroSequenceIndex]}
              </motion.h1>
            </AnimatePresence>
          )}

          {heroSequenceComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <h1 className="text-5xl md:text-7xl font-black mb-6 text-balance">{t.hero.headline}</h1>
              <p className="text-lg md:text-xl text-[#999999] mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
                {t.hero.subheadline}
              </p>
              <Button
                size="lg"
                className="bg-[#0066FF] hover:bg-[#0055DD] text-white shadow-[0_0_30px_rgba(0,102,255,0.4)] hover:shadow-[0_0_40px_rgba(0,102,255,0.6)] transition-all duration-200 px-8"
                onClick={() => handleOpenPreForm("analyze", "hero", "hero_analyze_project")}
              >
                {t.hero.cta}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: heroSequenceComplete ? 1 : 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#999999] text-sm z-10"
        >
          <span>{t.hero.scroll}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Belief Statement */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-12">{t.belief.title}</h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 leading-relaxed"
            >
              {t.belief.text1}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-[#999999] mb-8 leading-relaxed whitespace-pre-line"
            >
              {t.belief.text2}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl font-bold leading-relaxed"
            >
              {t.belief.text3}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: What We Do */}
      <section id="what-we-do" className="relative py-32 px-6 md:px-12 bg-black">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              {t.services.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-[#CCCCCC] max-w-3xl"
            >
              {t.services.subtitle}
            </motion.p>
          </div>

          <div className="flex flex-col gap-8">
            {t.services.items.map((service, index) => (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative h-[60vh] min-h-[500px] rounded-lg overflow-hidden group cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={service.icon || "/placeholder.svg"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="eager"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-5xl font-bold text-[#0066FF]">{service.number}</div>
                    <div className="w-16 h-16 rounded border border-[#0066FF] overflow-hidden flex-shrink-0">
                      <img
                        src={service.icon || "/placeholder.svg"}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-[#0066FF] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-4">{service.description}</p>
                    <button className="inline-flex items-center gap-2 text-white group-hover:text-[#0066FF] transition-colors">
                      Explore
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Work */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">{t.work.title}</h2>
            <p className="text-lg text-[#999999] max-w-2xl leading-relaxed whitespace-pre-line">{t.work.subtitle}</p>
          </motion.div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-4 mb-12">
            {t.work.filters.map((filter, index) => (
              <button
                key={index}
                onClick={() => setWorkFilter(filter)}
                className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                  workFilter === filter
                    ? "border-[#0066FF] bg-[#0066FF] text-white"
                    : "border-[#333333] text-[#999999] hover:border-[#0066FF] hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.client}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{project.client}</h3>
                  <p className="text-sm text-[#999999] mb-2">{project.category}</p>
                  <p className="text-sm leading-relaxed">{project.description}</p>

                  <button className="mt-4 text-sm flex items-center gap-2 text-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" className="border-[#0066FF] text-white hover:bg-[#0066FF] bg-transparent">
              {t.work.viewAll}
            </Button>
          </div>
        </div>
      </section>

      {/* Section 5: Results */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-black to-[#001a33]">
        <div className="max-w-[1440px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-20"
          >
            {t.results.title}
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {t.results.metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-black text-white mb-4">{metric.value}</div>
                <div className="text-sm text-[#999999] leading-relaxed">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: About */}
      <section id="about" className="py-32 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">{t.about.text1}</p>
            <p className="text-xl text-[#999999] mb-8 leading-relaxed">{t.about.text2}</p>
            <p className="text-lg leading-relaxed mb-12">{t.about.text3}</p>

            <Button variant="outline" className="border-[#0066FF] text-white hover:bg-[#0066FF] bg-transparent">
              {t.about.cta}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 7: Thinking */}
      <section id="thinking" className="py-32 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">{t.thinking.title}</h2>
            <p className="text-lg text-[#999999]">{t.thinking.subtitle}</p>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-72 md:w-auto p-6 border border-[#333333] rounded-lg hover:border-[#0066FF] hover:scale-103 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-xs text-[#0066FF] mb-4 font-medium">{article.category}</div>
                <h3 className="text-lg font-bold mb-4 leading-tight">{article.title}</h3>
                <a href="#" className="text-sm text-[#999999] hover:text-white transition-colors">
                  Read →
                </a>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-[#0066FF] text-white hover:bg-[#0066FF] bg-transparent">
              {t.thinking.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Section 8: Careers */}
      <section ref={careersRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: careersY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop"
            alt="Team collaboration"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">{t.careers.text}</p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              onClick={() => handleOpenPreForm("conversation", "Careers", "careers_see_job_openings")}
            >
              {t.careers.cta}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-br from-black via-[#001a33] to-[#0066FF]">
        <div className="max-w-[1440px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-balance">{t.finalCta.title}</h2>
            <p className="text-xl text-[#999999] mb-12 text-balance">{t.finalCta.subtitle}</p>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#0066FF] hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all"
              onClick={() => handleOpenPreForm("analyze", "final_cta", "final_analyze_project")}
            >
              {t.finalCta.cta}
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      <section ref={contactRef} id="contact" className="py-32 px-6 md:px-12 bg-black border-t border-[#333333]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-balance">{t.contactForm.title}</h2>
              <p className="text-xl text-[#999999] mb-12 leading-relaxed">{t.contactForm.subtitle}</p>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-[#999999] mb-2">Email</div>
                  <a
                    href="mailto:business@whatamatters.com"
                    className="text-[#0066FF] hover:text-[#4D94FF] transition-colors text-lg font-medium"
                  >
                    {t.contactForm.email}
                  </a>
                </div>

                <div>
                  <div className="text-sm text-[#999999] mb-2">Phone</div>
                  <a
                    href="tel:+12405550199"
                    className="text-[#0066FF] hover:text-[#4D94FF] transition-colors text-lg font-medium"
                  >
                    {t.contactForm.phone}
                  </a>
                </div>

                <div>
                  <div className="text-sm text-[#999999] mb-3">Follow us</div>
                  <div className="flex gap-4">
                    {["LinkedIn", "Instagram", "Twitter"].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-white hover:text-[#0066FF] transition-colors font-medium hover:scale-110 transform duration-200"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.contactForm.namePlaceholder}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-6 py-4 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#0066FF] transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.contactForm.emailPlaceholder}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-6 py-4 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#0066FF] transition-colors"
                  />
                </div>

                <div>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-6 py-4 text-white focus:outline-none focus:border-[#0066FF] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="text-[#666666]">
                      {t.contactForm.projectTypeLabel}
                    </option>
                    {t.contactForm.projectTypes.map((type) => (
                      <option key={type} value={type} className="text-white bg-[#111111]">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.contactForm.messagePlaceholder}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-6 py-4 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0066FF] hover:bg-[#4D94FF] text-white px-8 py-6 text-lg font-bold hover:scale-[1.02] transition-all duration-200"
                  onClick={() => handleOpenPreForm("analyze", "Contact Form", "contact_form_send_message")}
                >
                  {t.contactForm.submitButton}
                </Button>
              </form>

              {/* Success Message Animation */}
              <AnimatePresence>
                {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-[#111111] border-2 border-[#0066FF] rounded-lg flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-[#0066FF] flex items-center justify-center mb-4"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-black mb-2">{t.contactForm.messageSent}</h3>
                    <p className="text-[#999999]">{t.contactForm.messageSentSubtitle}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-[#333333] py-16 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          {/* Contact Block */}
          <div className="text-center mb-20">
            <h3 className="text-3xl font-black mb-8">{t.footer.letsTalk}</h3>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleOpenPreForm("conversation", "footer", "footer_chat")}
                className="bg-[#0066FF] hover:bg-[#4D94FF] text-white"
              >
                {t.footer.chat}
              </Button>
              <Button
                onClick={() => handleOpenPreForm("conversation", "footer", "footer_with_us")}
                className="bg-[#0066FF] hover:bg-[#4D94FF] text-white border-0"
              >
                {t.footer.withUs}
              </Button>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-bold mb-4">Channels</h4>
              <ul className="space-y-2 text-sm text-[#999999]">
                {t.footer.channels.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-[#0066FF] transition-colors hover:translate-x-1 inline-block transform duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legalities</h4>
              <ul className="space-y-2 text-sm text-[#999999]">
                {t.footer.legalities.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-[#0066FF] transition-colors hover:translate-x-1 inline-block transform duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-[#999999]">
                <li>
                  <a
                    href="mailto:business@whatamatters.com"
                    className="hover:text-[#0066FF] transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    Become a Client
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:press@whatamatters.com"
                    className="hover:text-[#0066FF] transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    Press Inquiries
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:jobs@whatamatters.com"
                    className="hover:text-[#0066FF] transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@whatamatters.com"
                    className="hover:text-[#0066FF] transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    Everything Else
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Headquarters</h4>
              <ul className="space-y-2 text-sm text-[#999999]">
                {t.footer.headquarters.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#333333] gap-4">
            <div className="text-sm text-[#999999]">{t.footer.copyright}</div>
            <button
              onClick={scrollToTop}
              className="text-sm text-[#999999] hover:text-[#0066FF] transition-colors hover:scale-105 transform duration-200"
            >
              {t.footer.backToTop} ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Contact Modal - kept for backward compatibility */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] border border-[#333333] rounded-lg p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black">Become a client</h3>
                <button onClick={() => setShowContactModal(false)} className="text-[#999999] hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-[#999999]">How else can we help?</p>
                <div>
                  <div className="text-white mb-1">• Become a client:</div>
                  <a href="mailto:business@whatamatters.com" className="text-[#0066FF] hover:underline">
                    business@whatamatters.com
                  </a>
                </div>
                <div>
                  <div className="text-white mb-1">• Join us:</div>
                  <a href="mailto:jobs@whatamatters.com" className="text-[#0066FF] hover:underline">
                    jobs@whatamatters.com
                  </a>
                </div>
                <div>
                  <div className="text-white mb-1">• Press inquiries:</div>
                  <a href="mailto:press@whatamatters.com" className="text-[#0066FF] hover:underline">
                    press@whatamatters.com
                  </a>
                </div>
                <div>
                  <div className="text-white mb-1">• Everything else:</div>
                  <a href="mailto:hello@whatamatters.com" className="text-[#0066FF] hover:underline">
                    hello@whatamatters.com
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFloatingButton && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={() => handleOpenPreForm("conversation", "floating", "floating_connect")}
            className="fixed top-24 right-6 z-50 bg-[#0066FF] hover:bg-[#0055DD] text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,102,255,0.4)] hover:shadow-[0_0_30px_rgba(0,102,255,0.6)] transition-all duration-200 font-medium text-sm flex items-center gap-2"
          >
            Let's connect
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
              <ArrowRight size={16} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
