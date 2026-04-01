import type { Metadata } from "next"
import { Barlow, Barlow_Condensed } from "next/font/google"
import styles from "./page.module.css"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
})

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
})

const whatsappUrl =
  "https://wa.me/17866629921?text=Hola%2C%20quiero%20saber%20cu%C3%A1nto%20est%C3%A1%20perdiendo%20mi%20negocio.%20Vi%20el%20Revenue%20Leak%20Score%20en%20whatamatters.com"

const leakCards = [
  {
    title: "CONTRACTORS · ROOFING · REMODELING · HVAC",
    location: "Gaithersburg, MD",
    value: "$16,464/mes",
    description:
      "Tu competidor aparece primero en Google Maps. Sus reseñas duplican las tuyas. Cada búsqueda que no te encuentra es un trabajo que va a otro lado.",
  },
  {
    title: "TAX & SEGUROS · ITIN · PERSONAL · BUSINESS",
    location: "Silver Spring, MD",
    value: "$2,842/mes",
    description:
      "En temporada alta, Silver Spring genera miles de búsquedas mensuales de servicios fiscales. Las firmas con mejor presencia digital se llevan la mayoría. La tuya no está entre ellas todavía.",
  },
  {
    title: "CLEANING · RESIDENTIAL · OFFICE",
    location: "Rockville, MD",
    value: "$1,353/mes",
    description:
      "El cliente de cleaning busca en Google, lee reseñas y decide en minutos. Si tu competidor tiene 10 veces más reseñas que tú, la decisión ya está tomada antes de que te encuentren.",
  },
  {
    title: "HOSPITALITY · RESTAURANTES · SPORTS BAR",
    location: "Damascus, MD",
    value: "$2,586/año",
    description:
      "La ficha de Google de tu restaurante es tu menú más importante. Si está incompleta o desactualizada, los clientes que te buscan encuentran a otro.",
  },
]

const rlsItems = [
  {
    number: "01",
    title: "TU SCORE DIGITAL · 0 a 100",
    description:
      "Un número que resume el estado real de tu presencia digital: visibilidad, credibilidad, conversión y entrega. Sin estimaciones. Con los datos de tu negocio hoy.",
  },
  {
    number: "02",
    title: "TUS 5 FUGAS PRINCIPALES · CON COSTO EN $",
    description:
      "Los 5 puntos donde tu negocio está perdiendo dinero — en orden de impacto. Cada fuga tiene un monto exacto asociado. Sabes dónde está el problema antes de gastar un dólar en arreglarlo.",
  },
  {
    number: "03",
    title: "TU PÉRDIDA MENSUAL Y ANUAL",
    description:
      "No un rango. No un promedio de industria. Tu número — calculado con tu CTR real, tu tasa de conversión real, tu ticket promedio real, tu zona geográfica real.",
  },
  {
    number: "04",
    title: "PLAN DE ACCIÓN · 45 DÍAS · 3 SPRINTS",
    description:
      "Los pasos concretos para cerrar las fugas más críticas. En orden de prioridad. Sin jerga técnica. Con lo que hay que hacer primero y por qué.",
  },
]

const steps = [
  {
    number: "01",
    title: "AGENDAS UNA SESIÓN DE 45 MINUTOS",
    description:
      "Online o en persona en MoCo. Sin formularios largos. Sin preparación previa de tu parte. Solo el nombre de tu negocio y tu zona.",
  },
  {
    number: "02",
    title: "REVISAMOS TU NEGOCIO DONDE TUS CLIENTES TE BUSCAN",
    description:
      "Google Maps, tu sitio web, tus reseñas, tu competencia directa en tu zona. Trabajamos con los datos que existen hoy — no con lo que tú crees que hay.",
  },
  {
    number: "03",
    title: "TE ENTREGAMOS TU NÚMERO Y TU PLAN",
    description:
      "Antes de terminar la sesión tienes: tu score, tus 5 fugas con costo en dólares, y los 3 pasos más urgentes para cerrar la más grande. Sin decks. Sin propuestas genéricas.",
  },
]

const criteria = [
  "Tienes un negocio funcionando en Montgomery County, MD",
  "La mayoría de tus clientes llegan por referidos — no por Google",
  "Alguna vez buscaste tu negocio en Google y no apareciste donde debías",
  "Llevas 2 o más años operando y nunca has medido cuántos clientes llegan desde internet",
  "Trabajas en contractors, cleaning, taxes, seguros o restaurantes",
]

const credibilityItems = [
  {
    number: "DATO 01",
    title: "OPERAMOS SOLO EN MONTGOMERY COUNTY, MD",
    description:
      "No somos una agencia que sirve a 12 mercados distintos con el mismo template. Conocemos Wheaton, Gaithersburg, Rockville, Silver Spring y Damascus — los benchmarks de estas zonas, los competidores de estas zonas, las búsquedas de estas zonas.",
  },
  {
    number: "DATO 02",
    title: "LOS BENCHMARKS SON VERIFICADOS",
    description:
      "Los números de pérdida estimada por vertical fueron construidos cruzando datos de FirstPageSage (CTR local 2025), WordStream (tasas de conversión por industria 2024), BrightLocal (volumen de reseñas 2026) e IBISWorld (ticket promedio y márgenes por sector 2025). No son promedios nacionales genéricos.",
  },
  {
    number: "DATO 03",
    title: "TU NÚMERO NO ES EL PROMEDIO — ES EL TUYO",
    description:
      "El diagnóstico no usa la cifra de tu vertical como resultado. La usa como referencia para calcular, con los datos reales de tu negocio — tu CTR actual, tu tasa de conversión, tu ticket, tu zona exacta — lo que estás perdiendo tú. Esa es la diferencia entre un reporte y un diagnóstico.",
  },
  {
    number: "DATO 04",
    title: "EL DIAGNÓSTICO ES EL PRODUCTO",
    description:
      "WhatAMatters construyó el Revenue Leak Score™ porque es la herramienta que usamos para auditar nuestra propia presencia digital. Antes de diagnosticar tu negocio, diagnosticamos el nuestro. Lo que ves aquí es el resultado de aplicar el mismo sistema que le entregamos al cliente.",
  },
]

const finalDeliverables = [
  "Score 0–100 de tu presencia digital",
  "Tus 5 fugas con costo exacto en $",
  "Tu pérdida mensual y anual real",
  "Plan de acción de 45 días",
]

export const metadata: Metadata = {
  title: "Revenue Leak Score™ | WhatAMatters",
  description:
    "Landing del Revenue Leak Score™ para Montgomery County, MD. Diagnóstico gratuito de 45 minutos con score, fugas y plan de acción.",
}

function CtaLink() {
  return (
    <a className={styles.cta} href={whatsappUrl} target="_blank" rel="noreferrer">
      Ver cuánto estoy perdiendo
    </a>
  )
}

export default function RevenueLeakScorePage() {
  return (
    <main className={`${barlow.variable} ${barlowCondensed.variable} ${styles.page}`}>
      <div className={styles.entryBand}>
        <span>DIAGNÓSTICO GRATUITO · PLAZAS LIMITADAS · MONTGOMERY COUNTY, MD · CAMPAÑA DE LANZAMIENTO 2026</span>
      </div>

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>
                TU NEGOCIO EN MONTGOMERY COUNTY ESTÁ PERDIENDO CLIENTES AHORA MISMO.
                <span className={styles.heroTitleBreak}>Ya sabemos cuánto. Falta que lo sepas tú.</span>
              </h1>
              <p className={styles.bodyLarge}>
                El Revenue Leak Score™ calcula en 45 minutos el número exacto de dinero que tu negocio pierde por no
                aparecer donde tus clientes te buscan. Un número real. Tu negocio. Tu zona.
              </p>
              <CtaLink />
            </div>

            <div className={styles.referenceBlock}>
              <div className={styles.referenceValue}>$16,464/mes</div>
              <p className={styles.referenceLabel}>← pérdida promedio · Contractors · Gaithersburg, MD</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>LO QUE ESTÁ SALIENDO DE TU NEGOCIO CADA MES</h2>
            <p className={styles.bodyText}>
              Estos son los promedios del mercado. Tu número puede ser mayor o menor — por eso existe el diagnóstico.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {leakCards.map((card) => (
              <article key={`${card.title}-${card.location}`} className={styles.dataCard}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardLocation}>{card.location}</p>
                <p className={styles.cardValue}>{card.value}</p>
                <p className={styles.bodyText}>{card.description}</p>
              </article>
            ))}
          </div>

          <div className={styles.footnote}>
            <p>Estos son promedios verificados del mercado de Montgomery County, MD.</p>
            <p>
              Tu número exacto lo calculamos en 45 minutos — con los datos reales de tu negocio, tu zona y tu
              competencia directa.
            </p>
            <p>Fuente: Digital Score Health USA PyMEs v0.6</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>45 MINUTOS. TU NÚMERO EXACTO. TU PLAN.</h2>
            <p className={styles.bodyText}>
              El Revenue Leak Score™ no es una reunión de ventas. Es un diagnóstico con datos reales de tu negocio —
              entregado en una sesión.
            </p>
          </div>

          <div className={styles.numberedList}>
            {rlsItems.map((item) => (
              <article key={item.number} className={styles.numberedItem}>
                <div className={styles.itemNumber}>{item.number}</div>
                <div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.bodyText}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.specsBlock}>
            <div>
              <p className={styles.specLabel}>TIEMPO</p>
              <p className={styles.specValue}>45 minutos</p>
            </div>
            <div>
              <p className={styles.specLabel}>COSTO</p>
              <p className={styles.specValue}>Gratuito — es la puerta de entrada, no el servicio completo</p>
            </div>
            <div>
              <p className={styles.specLabel}>FORMATO</p>
              <p className={styles.specValue}>Online o en persona en Montgomery County, MD</p>
            </div>
          </div>

          <p className={styles.bodyText}>
            No es una presentación de ventas. Es un diagnóstico con números reales. Si no ves valor en los primeros 20
            minutos, para — y no hay siguiente paso.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>ASÍ FUNCIONA — SIN COMPLICACIONES</h2>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <article key={step.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.bodyText}>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>ESTO ES PARA TI SI:</h2>
          </div>

          <ul className={styles.criteriaList}>
            {criteria.map((criterion) => (
              <li key={criterion} className={styles.criteriaItem}>
                <span className={styles.criteriaMark}>✕</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>

          <div className={styles.ctaBlock}>
            <p className={styles.bodyLarge}>Si marcaste 3 o más — tu número está esperando.</p>
            <CtaLink />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>POR QUÉ LOS NÚMEROS SON REALES</h2>
          </div>

          <div className={styles.cardGrid}>
            {credibilityItems.map((item) => (
              <article key={item.number} className={styles.dataCard}>
                <p className={styles.cardKicker}>{item.number} ——</p>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.bodyText}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.finalSection}`}>
        <div className={styles.container}>
          <div className={styles.finalWrap}>
            <h2 className={styles.finalTitle}>
              EL NÚMERO YA EXISTE.
              <span className={styles.heroTitleBreak}>SOLO FALTA CALCULARLO PARA TU NEGOCIO.</span>
            </h2>

            <p className={styles.bodyLarge}>
              Cada mes que pasa sin el diagnóstico es un mes más de pérdida medible. El Revenue Leak Score™ no cambia
              tu negocio de la noche a la mañana — pero en 45 minutos sabes exactamente por dónde se va el dinero. Y
              eso cambia todo.
            </p>

            <div className={styles.finalListBlock}>
              <p className={styles.listLead}>Lo que obtienes:</p>
              <ul className={styles.criteriaList}>
                {finalDeliverables.map((item) => (
                  <li key={item} className={styles.criteriaItem}>
                    <span className={styles.finalMark}>✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.specsInline}>
              <span>COSTO: Gratuito</span>
              <span>TIEMPO: 45 minutos</span>
              <span>COMPROMISO: Ninguno</span>
            </div>

            <CtaLink />

            <p className={styles.disclaimer}>
              Sin pitch de ventas al final. Si no ves valor en lo que entregamos, no hay siguiente paso — y no hay
              presión para que lo haya.
            </p>
            <p className={styles.disclaimer}>Sesión disponible en español · Online o en persona en Montgomery County, MD</p>
          </div>
        </div>
      </section>
    </main>
  )
}
