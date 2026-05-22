import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Setup file paths for the file-based fallback database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'legal_comfort_db.json');

export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  jurisdiction: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: 'New' | 'Reviewed' | 'Contacted' | 'Scheduled' | 'Closed' | 'Archived';
  notes?: string;
  created_at: string;
}

export interface AvailabilitySettings {
  blocked_dates: string[]; // List of dates "YYYY-MM-DD"
  working_hours: { start: string; end: string }; // e.g. { start: '09:00', end: '14:00' }
}

interface DatabaseSchema {
  bookings: Booking[];
  availability: AvailabilitySettings;
}

// Default pre-populated records for stable out-of-the-box reviews
const DEFAULT_SCHEMA: DatabaseSchema = {
  bookings: [
    {
      id: "booking-101",
      client_name: "Hendrik Overeem",
      client_email: "h.overeem@overeemfinance.sr",
      client_phone: "+597 882-1492",
      jurisdiction: "corporate",
      preferred_date: "2026-06-02",
      preferred_time: "10:00",
      message: "Verzoek tot advies en statutenwijziging voor holding NV in verband met buitenlandse investeerder-bepalingen in Suriname.",
      status: "New",
      notes: "Prioriteit. Buitenlandse investeerdersregeling doorspreken.",
      created_at: "2026-05-19T09:12:00Z"
    },
    {
      id: "booking-102",
      client_name: "Samantha Alida",
      client_email: "samantha.alida@gmail.com",
      client_phone: "+597 854-1029",
      jurisdiction: "family",
      preferred_date: "2026-06-03",
      preferred_time: "11:30",
      message: "Request guidance on inheritance and estate partition at Hofstraat office chambers. Need to discuss parental authority clauses.",
      status: "Scheduled",
      notes: "Afspraak gepland op kantoor. Alle documenten van de boedelscheiding meenemen.",
      created_at: "2026-05-20T14:45:00Z"
    },
    {
      id: "booking-103",
      client_name: "Radjish Ramdin",
      client_email: "r.ramdin@ramdin-trade.sr",
      client_phone: "+597 876-4321",
      jurisdiction: "employment",
      preferred_date: "2026-06-05",
      preferred_time: "09:00",
      message: "Arbeidsovereenkomst beëindiging met wederzijds goedvinden (vaststellingsovereenkomst). Controleren op conformiteit Surinaams recht.",
      status: "Reviewed",
      notes: "Vaststellingsovereenkomst nagekeken. Wachten op akkoord client voor contact.",
      created_at: "2026-05-21T08:10:00Z"
    }
  ],
  availability: {
    blocked_dates: ["2026-05-25", "2026-06-01"], // e.g. national holidays
    working_hours: { start: "09:00", end: "14:00" }
  }
};

let supabase: SupabaseClient | null = null;
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase db client initialized successfully.");
  } catch (err) {
    console.warn("Could not connect to Supabase, running Local Database Fallback mode.", err);
  }
} else {
  console.log("No Supabase configuration detected in env. Running Local Database Fallback mode.");
}

// Safeguard DB file setup for JSON backend
function initLocalDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SCHEMA, null, 2), 'utf8');
  }
}

// Read JSON DB file safely
function readLocalDb(): DatabaseSchema {
  initLocalDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read local DB file, restoring defaults.", err);
    return DEFAULT_SCHEMA;
  }
}

// Write JSON DB file safely
function writeLocalDb(data: DatabaseSchema) {
  initLocalDbFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to write local DB file:", err);
  }
}

export const db = {
  // Check if Supabase mode is active
  isSupabaseActive(): boolean {
    return supabase !== null;
  },

  // 1. Get all bookings
  async getBookings(): Promise<Booking[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data as Booking[];
      }
      console.warn("Supabase bookings fetch error, using local fallback:", error);
    }
    return readLocalDb().bookings;
  },

  // 2. Add a new booking (prevent basic double bookings on same time slot)
  async saveBooking(booking: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<Booking> {
    const date = booking.preferred_date;
    const time = booking.preferred_time;

    // Check double booking
    const bookings = await this.getBookings();
    const isDouble = bookings.some(b => 
      b.preferred_date === date && 
      b.preferred_time === time && 
      b.status !== 'Closed' && 
      b.status !== 'Archived'
    );

    if (isDouble) {
      throw new Error("This high-value time slot is already reserved by another client. Please select a different time slot.");
    }

    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'New',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select()
        .single();
      
      if (!error && data) {
        return data as Booking;
      }
      console.warn("Supabase insert failed, inserting locally:", error);
    }

    const localDb = readLocalDb();
    localDb.bookings.unshift(newBooking);
    writeLocalDb(localDb);
    return newBooking;
  },

  // 3. Update status of a booking
  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as Booking;
      }
      console.warn("Supabase update status failed, updating locally:", error);
    }

    const localDb = readLocalDb();
    const index = localDb.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found.`);
    }
    localDb.bookings[index].status = status;
    writeLocalDb(localDb);
    return localDb.bookings[index];
  },

  // 4. Update admin private notes for a booking
  async updateBookingNotes(id: string, notes: string): Promise<Booking> {
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ notes })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as Booking;
      }
      console.warn("Supabase update notes failed, updating locally:", error);
    }

    const localDb = readLocalDb();
    const index = localDb.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found.`);
    }
    localDb.bookings[index].notes = notes;
    writeLocalDb(localDb);
    return localDb.bookings[index];
  },

  // 5. Delete a booking (and archived)
  async deleteBooking(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      if (!error) {
        return true;
      }
      console.warn("Supabase delete failed, deleting locally:", error);
    }

    const localDb = readLocalDb();
    const filtered = localDb.bookings.filter(b => b.id !== id);
    if (filtered.length === localDb.bookings.length) {
      return false;
    }
    localDb.bookings = filtered;
    writeLocalDb(localDb);
    return true;
  },

  // 6. Get availability settings (working schedule/blocked dates)
  async getAvailability(): Promise<AvailabilitySettings> {
    if (supabase) {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .single();
      if (!error && data) {
        return data as AvailabilitySettings;
      }
      console.warn("Supabase availability fetch failed, using local:", error);
    }
    return readLocalDb().availability;
  },

  // 7. Update availability settings (blocked dates, hours)
  async saveAvailability(availability: AvailabilitySettings): Promise<AvailabilitySettings> {
    if (supabase) {
      const { data, error } = await supabase
        .from('availability')
        .upsert(availability)
        .select()
        .single();
      if (!error && data) {
        return data as AvailabilitySettings;
      }
      console.warn("Supabase availability save failed, saving locally:", error);
    }

    const localDb = readLocalDb();
    localDb.availability = availability;
    writeLocalDb(localDb);
    return availability;
  }
};
