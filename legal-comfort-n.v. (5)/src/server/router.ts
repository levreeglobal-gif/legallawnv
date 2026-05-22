import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { db, Booking, AvailabilitySettings } from './db.js';

dotenv.config();

export const apiRouter = Router();

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
         },
      },
    });
  }
  return aiInstance;
}

// Secure Token Scheme for Fallback mode
const SECURE_ADMIN_TOKEN = process.env.ADMIN_SESSION_TOKEN || "LC-ADMIN-AUTHENTICATED-TOKEN-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "levreeglobal@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Paramaribo2026!";

// Middleware to verify Admin Authorization Token
function verifyAdminToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access denied. Valid authorization token is missing." });
  }
  const token = authHeader.split(' ')[1];
  if (token !== SECURE_ADMIN_TOKEN) {
    return res.status(403).json({ error: "Access denied. Invalid or expired administrative session token." });
  }
  next();
}

// ── ADMIN AUTHENTICATION ──
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All credentials must be supplied." });
    }

    // Try env credentials validation (with robust defaults)
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: SECURE_ADMIN_TOKEN,
        user: { email: ADMIN_EMAIL, role: "Administrator" }
      });
    }

    // Attempt Supabase Auth login if Supabase client is active
    if (db.isSupabaseActive() && email && password) {
      // In a real supabase scenario, can sign in with client directly (handled here conceptually)
      return res.status(401).json({ error: "Invalid credentials. Please double-check administrative details." });
    }

    return res.status(401).json({ error: "Invalid administrative credentials." });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Internal server authorization failure." });
  }
});

// ── PUBLIC SLOTS ENQUIRY (Double Booking Protection) ──
apiRouter.get('/slots', async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: "Valid target inquiry date is required." });
    }

    // Get current availability configuration from database
    const availability = await db.getAvailability();

    // If date is explicitly blocked (e.g., weekends, holidays)
    if (availability.blocked_dates.includes(date)) {
      return res.json({ date, openSlots: [] });
    }

    // Standard working hours are configured from 09:00 to 14:00 (5 hours intervals)
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00'];
    
    // Get all existing active bookings to prevent double-booking
    const bookings = await db.getBookings();
    const busySlots = bookings
      .filter(b => b.preferred_date === date && b.status !== 'Closed' && b.status !== 'Archived')
      .map(b => b.preferred_time);

    // Compute difference (available slots)
    const openSlots = baseSlots.filter(slot => !busySlots.includes(slot));

    return res.json({
      date,
      openSlots,
      workingHours: availability.working_hours
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to retrieve open slots." });
  }
});

// ── CUSTOMER CONFIRMATION & ADMIN EMAIL DISPATCHERS ──
async function triggerBilingualNotification(booking: Booking, isClient: boolean) {
  const lang = booking.jurisdiction === 'family' || booking.jurisdiction === 'civil' ? 'nl' : 'en';
  
  const clientSubject = lang === 'nl'
    ? `✓ Bevestiging Intake-aanvraag - Legal Comfort N.V.`
    : `✓ Confirmation: Consultation Intake - Legal Comfort N.V.`;
    
  const adminSubject = `[URGENT] New Legal Intake Requested: ${booking.client_name}`;

  const clientBody = lang === 'nl'
    ? `Geachte ${booking.client_name},

Hartelijk dank voor uw aanvraag voor een juridische intake bij Advocatenkantoor Legal Comfort N.V.

Uw reservering is succesvol geregistreerd:
- Rechtsgebied: ${booking.jurisdiction.toUpperCase()}
- Voorkeursdatum: ${booking.preferred_date}
- Gereserveerd Tijdstip: ${booking.preferred_time} uur (Surinaamse tijd)
- Kantoorlocatie: Hofstraat no. 26, Paramaribo

Samenvatting van uw case-omschrijving:
"${booking.message}"

Onze balie zal deze aanvraag discreet evalueren. Wij nemen binnen één werkdag contact met u op voor de definitieve geverifieerde bevestiging.

Met hoogachting,
Legal Comfort N.V.
Advocatenkantoor Paramaribo`
    : `Dear ${booking.client_name},

Thank you for requesting a legal intake with Legal Comfort N.V. Law Firm.

Your reservation file has been securely registered in our system:
- Practice Domain: ${booking.jurisdiction.toUpperCase()}
- Preferred Date: ${booking.preferred_date}
- Reserved Time Slot: ${booking.preferred_time} (Suriname Time)
- Office Chambers: Hofstraat no. 26, Paramaribo

Your submitted inquiry overview:
"${booking.message}"

Our chambers will review your dossier with strict confidentiality. We will contact you within one business day via your details (${booking.client_phone} / ${booking.client_email}) for final authorization.

Sincerely,
Legal Comfort N.V.
Paramaribo Office Chambers`;

  const adminBody = `ADMIN ALERT: NEW INTAKE INQUIRY SUBMITTED

An automated file file has been logged in Legal Comfort NV Database.
Please review the case immediately in the admin panel:
- Client Name: ${booking.client_name}
- Email: ${booking.client_email}
- Phone: ${booking.client_phone}
- Service Area: ${booking.jurisdiction}
- Consultation Date: ${booking.preferred_date} at ${booking.preferred_time}
- Matter Summary:
"${booking.message}"

Admin Action Required: Visit https://www.legalcomfortnv.com/admin to schedule, update status, and add private consultation findings.`;

  const recipient = isClient ? booking.client_email : ADMIN_EMAIL;
  const subject = isClient ? clientSubject : adminSubject;
  const body = isClient ? clientBody : adminBody;

  // Real SMTP Transport Configured dynamically via env variables
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (host && user && pass) {
    try {
      const port = parseInt(process.env.EMAIL_PORT || '587');
      const secure = process.env.EMAIL_SECURE === 'true';
      const from = process.env.EMAIL_FROM || `"Legal Comfort Chambers" <${user}>`;
      
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass
        }
      });

      await transporter.sendMail({
        from,
        to: recipient,
        subject: subject,
        text: body
      });
      console.log(`[EMAIL DISPATCH SUCCESS] E-mail delivered successfully to: ${recipient}`);
    } catch (mailErr) {
      console.error(`[EMAIL DISPATCH FAILURE] Failed to send email to ${recipient}:`, mailErr);
    }
  } else {
    // If SMTP details are not fully in target env, provide diagnostic console printout but no crash
    console.log("\n==========================================================================");
    console.log(`[EMAIL SEND SIMULATOR - CONFIG NOT DETECTED] Dispatching to: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log("--------------------------------------------------------------------------");
    console.log(body);
    console.log("==========================================================================\n");
  }
}

// IP rate-limiting protection map for secure intake submissions
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const timeWindow = 60 * 60 * 1000; // 1 Hour window
  const maxSubmissions = 5; // Max 5 submissions per hour

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > timeWindow) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= maxSubmissions) {
    return true; // Limited!
  }

  record.count += 1;
  return false;
}

// ── CREATE NEW INTAKE / BOOKING (ANTI-SPAM VALIDATION) ──
apiRouter.post('/bookings', async (req, res) => {
  try {
    const clientIp = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'unknown');
    
    if (checkIpRateLimit(clientIp)) {
      return res.status(429).json({ error: "Too many submission attempts from this address. Please wait or contact our chambers directly via telephone or WhatsApp." });
    }

    const { name, email, phone, category, date, time, message, honeypot } = req.body;

    // Honeypot spam-bot filter
    if (honeypot) {
      console.warn(`[ANTISPAM] Honeypot triggered by IP: ${clientIp}`);
      return res.status(400).json({ error: "Request classified as automated spam." });
    }

    // Strict validation
    if (!name || !email || !phone || !category || !date || !time || !message) {
      return res.status(400).json({ error: "Every field is required for professional validation." });
    }

    if (!email.includes('@') || email.length < 5) {
      return res.status(400).json({ error: "Please submit a valid secure email address." });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: "Factual Case Overview must outline at least 15 characters for strategic intake quality." });
    }

    // Save using DB layer (with double booking validation)
    const saved = await db.saveBooking({
      client_name: name.trim(),
      client_email: email.trim(),
      client_phone: phone.trim(),
      jurisdiction: category,
      preferred_date: date,
      preferred_time: time,
      message: message.trim()
    });

    // Fire confirmations
    try {
      await triggerBilingualNotification(saved, true); // Client dispatch
      await triggerBilingualNotification(saved, false); // Admin alert dispatch
    } catch (e) {
      console.error("Notification trigger logged harmless error:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Consultation Request and Inquiry File filed securely in Chambers records.",
      booking: saved
    });
  } catch (error: any) {
    console.error("Booking error caught:", error);
    res.status(409).json({ error: error?.message || "Scheduling conflict or server error. Reservation failed." });
  }
});

// ── SECURE ADMIN BOOKINGS RETRIEVAL ──
apiRouter.get('/admin/bookings', verifyAdminToken, async (req, res) => {
  try {
    const bookings = await db.getBookings();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to retrieve booking records." });
  }
});

// ── SECURE ADMIN STATUS UPDATE ──
apiRouter.patch('/admin/bookings/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['New', 'Reviewed', 'Contacted', 'Scheduled', 'Closed', 'Archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status state value received." });
    }

    const updated = await db.updateBookingStatus(id, status);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Filing status update failed." });
  }
});

// ── SECURE ADMIN NOTES UPDATE ──
apiRouter.patch('/admin/bookings/:id/notes', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updated = await db.updateBookingNotes(id, notes);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Notes filing update failed." });
  }
});

// ── SECURE ADMIN DELETE RECORD ──
apiRouter.delete('/admin/bookings/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ error: "Bookings record with target reference not found." });
    }
    res.json({ success: true, message: "Booking record expunged from persistent database." });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to expunge bookings record." });
  }
});

// ── SECURE ADMIN AVAILABILITY RETRIEVAL ──
apiRouter.get('/admin/availability', verifyAdminToken, async (req, res) => {
  try {
    const availability = await db.getAvailability();
    res.json(availability);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Could not retrieve availability matrix." });
  }
});

// ── SECURE ADMIN AVAILABILITY SAVE ──
apiRouter.post('/admin/availability', verifyAdminToken, async (req, res) => {
  try {
    const { blocked_dates, working_hours } = req.body;
    if (!blocked_dates || !working_hours) {
      return res.status(400).json({ error: "Blocked dates and working boundaries are both required." });
    }

    const updated = await db.saveAvailability({ blocked_dates, working_hours });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Filing availability updates failed." });
  }
});

// ── ORIGINAL CHAT & AI REFINEMENT ENDPOINTS ──

// 1. Chat with Specialized Persona
apiRouter.post('/chat', async (req, res) => {
  try {
    const { message, history, persona } = req.body;
    const ai = getGeminiClient();

    let systemInstruction = 'You are a helpful assistant.';
    if (persona === 'architect') {
      systemInstruction = `You are a Technical System Architect. Your role is to break down complex tasks into robust, clear technical architectures. 
Describe database design, service flows, and code structures. Prefer using markdown, lists, and code blocks. Keep responses professional, analytical, and highly structured.`;
    } else if (persona === 'aesthetic') {
      systemInstruction = `You are a Visual Designer and UI Engineer. You focus on design tokens, elegant spacing, visual contrast, micro-animations, and CSS/Tailwind details. 
Suggest pristine visual treatments, layout groupings, typography pairings, and micro-interactions. Express details using design vocabulary. Keep answers inspiring and structured.`;
    } else if (persona === 'copywriter') {
      systemInstruction = `You are a Professional Editorial Copywriter. You refine prose, craft great narrative structures, hooks, and clean summaries. 
Your goal is to make text crisp, highly scannable, and extremely persuasive. Keep answers highly polished, concise, and beautifully framed.`;
    } else if (persona === 'strategist') {
      systemInstruction = `You are a Senior Product Manager and Product Strategist. You specialize in MVP scoping, prioritizing features, identifying target user value, and defining metrics. 
Help users structure work into milestones, cut out bloat, and maintain product velocity. Keep responses actionable and highly organized.`;
    }

    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        formattedContents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      }
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /chat:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate response' });
  }
});

// 2. Refine Text & Decompose into Checklists
apiRouter.post('/refine', async (req, res) => {
  try {
    const { text, action } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const ai = getGeminiClient();

    if (action === 'checklist') {
      // Structured JSON checklist decomposition
      const prompt = `Decompose the following project details, goals, or notes into a structured, step-by-step actionable checklist. 
Group items by phase and keep them highly specific:

Source Text:
"""
${text}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert organizer and planner. Always output a structured, hierarchical work breakdown matching the requested schema. Provide meaningful phase names and granular items.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'Unique simple slug or alphanumeric ID for state tracking (e.g., "setup-env").' },
                text: { type: Type.STRING, description: 'The main goal or action (e.g., "Install node dependencies and configure Vite server").' },
                phase: { type: Type.STRING, description: 'The name of the current milestone/phase (e.g., "Phase 1: Environment Setup").' },
                subtasks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Granular checkbox list sub-items to reach this milestone.'
                }
              },
              required: ['id', 'text', 'phase', 'subtasks']
            }
          }
        }
      });

      const responseText = response.text || '[]';
      try {
        const parsed = JSON.parse(responseText);
        res.json({ checklist: parsed });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse structured JSON response from model', raw: responseText });
      }
    } else {
      // General prose refinement
      let refinementPrompt = '';
      if (action === 'expand') {
        refinementPrompt = `Expand the following points, providing rich detailed steps, considerations, and suggestions to enrich the idea:\n\n${text}`;
      } else if (action === 'summarize') {
        refinementPrompt = `Provide a crisp, professional, high-level summary of the following content. Keep it short and highly scannable:\n\n${text}`;
      } else if (action === 'simplify') {
        refinementPrompt = `Re-write the following text into direct, simple, and elegant sentences. Keep it minimal and readable:\n\n${text}`;
      } else {
        refinementPrompt = `Proofread, edit, and beautify the spelling, grammar, and flow of the following paragraph:\n\n${text}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: refinementPrompt,
      });

      res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error('Error in /refine:', error);
    res.status(500).json({ error: error?.message || 'Failed to refine text' });
  }
});

// 3. Google Search Grounding Endpoint
apiRouter.post('/grounding', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources: Array<{ title: string; url: string }> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || 'Source',
            url: chunk.web.uri,
          });
        }
      }
    }

    // Deduplicate sources by URL
    const uniqueSources = sources.filter((val, index, self) =>
      self.findIndex(t => t.url === val.url) === index
    );

    res.json({
      text: response.text,
      sources: uniqueSources,
    });
  } catch (error: any) {
    console.error('Error in /grounding:', error);
    res.status(500).json({ error: error?.message || 'Failed to query grounding search' });
  }
});

