// lib/leadScoring.ts

// 1. Definimos la interfaz para asegurar tipos y documentar qué esperamos
export interface LeadInput {
  email?: string;
  stage?: string;
  message?: string;
  // Agrega aquí otros campos futuros como companySize, phone, etc.
}

export interface LeadClassification {
  score: number;
  tier: string;
  priority: string;
  action: string; // Útil para determinar qué template de email usar
}

export function calculateLeadScore(data: LeadInput): number {
  let score = 0;

  // Normalización segura de entradas (evita crashes por undefined)
  const stage = (data.stage || '').toLowerCase();
  const email = (data.email || '').toLowerCase();
  const message = (data.message || '').toLowerCase();

  // --- A. Firmografía: Stage ---
  const stageScores: Record<string, number> = {
    'established': 15,
    'growing': 10,
    'early-stage': 5,
    'just-idea': 0
  };
  // Si no coincide, 0 puntos.
  score += stageScores[stage] ?? 0;

  // --- B. Email Quality (Validación Estricta) ---
  if (email.includes('@')) {
    const domain = email.split('@')[1]; // Ya está en lowercase por la normalización
    
    // Lista de proveedores gratuitos comunes
    const freeProviders = new Set(['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com']);

    // Si NO está en la lista de gratuitos, asumimos corporativo (+15)
    // Si está en la lista, es personal (+2)
    const isPersonal = freeProviders.has(domain);
    score += isPersonal ? 2 : 15;
  } else {
    // Si el email es inválido, penalizamos o damos 0
    score -= 10; 
  }

  // --- C. Mensaje y Keywords ---
  if (message) {
    // Intención y Urgencia
    if (message.length > 150) score += 10;
    
    // Palabras clave de alto valor
    const highIntentKw = ['budget', 'presupuesto', 'urgent', 'urgente', 'pricing', 'cotización'];
    if (highIntentKw.some(w => message.includes(w))) score += 10;

    // Palabras clave negativas (Descalificadores)
    const lowIntentKw = ['cheap', 'barato', 'gratis', 'free', 'student', 'estudiante'];
    if (lowIntentKw.some(w => message.includes(w))) score -= 20;
  }

  // Retornamos el valor crudo, acotado entre 0 y 100 para consistencia
  // El máximo teórico actual ronda los 50-60 puntos, pero dejamos margen para crecer.
  return Math.max(0, Math.min(score, 100));
}

export function classifyLead(score: number): LeadClassification {
  // Ajuste de escala basado en que el Máximo Realista actual es aprox 50 puntos.
  
  // TIER 1: Requiere Stage fuerte + Email Corp + Mensaje relevante (> 35 puntos)
  if (score >= 35) {
    return { 
      score, 
      tier: 'TIER 1 (HOT)', 
      priority: 'VIP', 
      action: 'schedule_meeting_email' // Sugerencia para la automatización
    };
  }

  // TIER 2: Requiere al menos Email Corp o Stage bueno + Mensaje (> 20 puntos)
  if (score >= 20) {
    return { 
      score, 
      tier: 'TIER 2 (WARM)', 
      priority: 'CONSULTIVE', 
      action: 'send_case_study_email' 
    };
  }

  // TIER 3: Leads fríos, correos personales sin mensaje claro, etc.
  return { 
    score, 
    tier: 'TIER 3 (COLD/JUNK)', 
    priority: 'NURTURE', 
    action: 'subscribe_newsletter_email' 
  };
}