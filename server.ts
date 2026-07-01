import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const XOF_TO_SATS = 1.666;

const HOSPITALS_DB = [
  {
    id: "hz-calavi",
    name: "Hôpital de Zone d'Abomey-Calavi & Sô-Ava",
    type: "public",
    image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=600",
    rating: 4.3,
    reviewsCount: 142,
    distance: "1.2 km",
    address: "Rue de l'Hôpital de Zone, Quartier Sèmè-Podji, Abomey-Calavi",
    phone: "+229 21 36 01 22",
    hours: "Ouvert 24h/24",
    isVerified: true,
    services: ["Urgences", "Pédiatrie", "Maternité", "Chirurgie", "Médecine Générale"],
    priceList: [
      { name: "Consultation Médecine Générale", priceXOF: 2000, priceSats: 3330 },
      { name: "Bilan NFS / Sanguin Complet", priceXOF: 4500, priceSats: 7500 },
      { name: "Test Rapide Paludisme (GE)", priceXOF: 1500, priceSats: 2500 },
      { name: "Échographie Obstétricale", priceXOF: 8000, priceSats: 13320 },
      { name: "Ordonnance Traitement Paludisme type", priceXOF: 3500, priceSats: 5830 }
    ],
    reviews: [
      { id: "r1", author: "Pascal Houessou", rating: 5, date: "25 Juin 2026", comment: "Le service de pédiatrie est exceptionnel. Prise en charge très rapide pour mon fils." },
      { id: "r2", author: "Marielle Tossou", rating: 4, date: "12 Juin 2026", comment: "L'hôpital public de référence à Calavi. Parfois un peu d'attente aux urgences, mais les médecins sont très compétents." },
      { id: "r3", author: "Gaston Houndéton", rating: 4, date: "03 Juin 2026", comment: "Propre et bien organisé depuis la mise en place du paiement numérique. Pas de files d'attente interminables." }
    ],
    coords: { x: 48.0, y: 52.0 },
    lat: 6.4385,
    lng: 2.3412
  },
  {
    id: "chd-atlantique",
    name: "CHD Atlantique (Hôpital Universitaire)",
    type: "public",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    reviewsCount: 238,
    distance: "2.4 km",
    address: "Route Inter-États, Près du Campus Universitaire d'Abomey-Calavi (UAC)",
    phone: "+229 21 36 12 44",
    hours: "Ouvert 24h/24",
    isVerified: true,
    services: ["Urgences", "Cardiologie", "Radiologie", "Gynécologie", "Laboratoire d'analyses"],
    priceList: [
      { name: "Consultation Spécialiste", priceXOF: 5000, priceSats: 8330 },
      { name: "Radiographie Thoracique", priceXOF: 10000, priceSats: 16660 },
      { name: "Bilan Lipidique & Glycémie", priceXOF: 6000, priceSats: 10000 },
      { name: "Scanner Cérébral", priceXOF: 45000, priceSats: 75000 }
    ],
    reviews: [
      { id: "r4", author: "Chantal Agon", rating: 5, date: "18 Juin 2026", comment: "Équipements de pointe et professeurs très à l'écoute. Très bon suivi gynécologique." },
      { id: "r5", author: "Christian Soglo", rating: 4, date: "10 Juin 2026", comment: "Situé juste à côté de l'UAC. Pratique pour les étudiants et les habitants de Calavi." }
    ],
    coords: { x: 32.0, y: 38.0 },
    lat: 6.4182,
    lng: 2.3395
  },
  {
    id: "clinique-sainte-famille",
    name: "Clinique Privée Sainte-Famille",
    type: "private",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 85,
    distance: "3.8 km",
    address: "Quartier Zogbadjè, Face 2ème entrée du Campus, Abomey-Calavi",
    phone: "+229 97 45 11 89",
    hours: "07:00 - 22:00",
    isVerified: true,
    services: ["Médecine Générale", "Maternité", "Pédiatrie", "Dentisterie", "Échographie"],
    priceList: [
      { name: "Consultation Générale", priceXOF: 3000, priceSats: 5000 },
      { name: "Consultation Dentaire", priceXOF: 5000, priceSats: 8330 },
      { name: "Détartrage & Soins", priceXOF: 15000, priceSats: 25000 },
      { name: "Échographie Pelvienne", priceXOF: 10000, priceSats: 16660 }
    ],
    reviews: [
      { id: "r6", author: "Bienvenue Segnon", rating: 5, date: "29 Juin 2026", comment: "Le cadre est magnifique et d'une propreté impeccable. Service client très réactif." },
      { id: "r7", author: "Félicité Kpodékon", rating: 4, date: "21 Juin 2026", comment: "Clinique privée excellente. Les tarifs sont un peu plus élevés mais le confort et l'accueil le justifient largement." }
    ],
    coords: { x: 58.0, y: 28.0 },
    lat: 6.4255,
    lng: 2.3298
  },
  {
    id: "cs-calavi-centre",
    name: "Centre de Santé de Calavi-Centre",
    type: "clinic",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    rating: 3.9,
    reviewsCount: 56,
    distance: "0.8 km",
    address: "Avenue de la Mairie, En face de l'Hôtel de Ville, Abomey-Calavi",
    phone: "+229 21 36 04 11",
    hours: "08:00 - 18:00",
    isVerified: false,
    services: ["Vaccination", "Planification Familiale", "Consultation Prénatale", "Soins Infirmiers"],
    priceList: [
      { name: "Consultation Infirmière", priceXOF: 1000, priceSats: 1660 },
      { name: "Pansement & Injection", priceXOF: 800, priceSats: 1330 },
      { name: "Carnet de Santé & Pesée", priceXOF: 500, priceSats: 830 }
    ],
    reviews: [
      { id: "r8", author: "Ablavi Hounkpè", rating: 4, date: "14 Juin 2026", comment: "Centre public idéal pour les vaccins et suivis de bébé. Très abordable." }
    ],
    coords: { x: 44.0, y: 68.0 },
    lat: 6.4452,
    lng: 2.3478
  },
  {
    id: "clinique-solidarite",
    name: "Clinique de la Solidarité (Bidossessi)",
    type: "private",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600",
    rating: 4.2,
    reviewsCount: 42,
    distance: "1.9 km",
    address: "Bidossessi, à 200m du Carrefour Kpota, Abomey-Calavi",
    phone: "+229 95 33 22 11",
    hours: "08:00 - 20:00",
    isVerified: true,
    services: ["Médecine Générale", "Petite Chirurgie", "Analyses Médicales", "Pharmacie de garde"],
    priceList: [
      { name: "Consultation de Jour", priceXOF: 2500, priceSats: 4160 },
      { name: "Consultation d'Urgence / Nuit", priceXOF: 5000, priceSats: 8330 },
      { name: "Analyse d'Urine (ECBU)", priceXOF: 4000, priceSats: 6660 },
      { name: "Suture de Plaie Simple", priceXOF: 6000, priceSats: 10000 }
    ],
    reviews: [
      { id: "r9", author: "Marc Djivo", rating: 4, date: "26 Mai 2026", comment: "Clinique de quartier sérieuse. Prise en charge immédiate pour les petites urgences." }
    ],
    coords: { x: 74.0, y: 48.0 },
    lat: 6.4520,
    lng: 2.3595
  }
];

let APPOINTMENTS_DB = [
  {
    id: "apt-821",
    hospitalId: "hz-calavi",
    hospitalName: "Hôpital de Zone d'Abomey-Calavi & Sô-Ava",
    date: "2026-07-02",
    timeSlot: "10:30",
    patientName: "Bienvenue Segnon",
    status: "confirmed"
  }
];

let INVOICES_DB = [
  {
    id: "FACT-392817",
    patientName: "Bienvenue Segnon",
    patientPhone: "+229 97 88 55 44",
    hospitalName: "CHD Atlantique (Hôpital Universitaire)",
    hospitalAddress: "Route Inter-États, Près du Campus Universitaire d'Abomey-Calavi (UAC)",
    date: "20 Juin 2026 à 10:45",
    items: [
      { name: "Consultation Spécialiste", priceXOF: 5000 },
      { name: "Test Rapide Paludisme (GE)", priceXOF: 1500 }
    ],
    totalXOF: 6500,
    totalSats: 10790,
    paymentMethod: "Wallet",
    txHash: "tx_benin_0x5c7f763ab21e3f890ad678ec4532bce78d8fe0192",
    isPaid: true,
    doctorName: "Dr. Jean Sossou"
  }
];

const LIGHTNING_INVOICES_DB: Record<string, {
  id: string;
  amountXOF: number;
  amountSats: number;
  bolt11: string;
  isPaid: boolean;
  txHash: string;
  createdAt: number;
}> = {};

let ACCESS_REQUESTS_DB = [
  {
    id: "req-1",
    npi: "1097885544901",
    doctorEmail: "dr.sossou@sante.bj",
    hospitalName: "CHD Atlantique (Hôpital Universitaire)",
    status: "pending",
    requestedAt: "30/06/2026 à 08:15"
  }
];

const PATIENTS_DB: Record<string, any> = {
  "bienvenuesegnon@gmail.com": {
    name: "Bienvenue Segnon",
    email: "bienvenuesegnon@gmail.com",
    phone: "+229 97 88 55 44",
    walletBalance: 15000,
    npi: "1097885544901",
    avatar: "BS"
  },
  "alice.dovonou@gmail.com": {
    name: "Alice Dovonou",
    email: "alice.dovonou@gmail.com",
    phone: "+229 95 34 12 78",
    walletBalance: 45000,
    npi: "2095341278102",
    avatar: "AD"
  }
};

const HOSPITAL_USERS_DB = [
  {
    email: "admin@sante.bj",
    password: "123456",
    hospitalId: "system-admin",
    role: "admin",
    name: "Administrateur National"
  },
  {
    email: "dr.sossou@sante.bj",
    password: "123456",
    hospitalId: "chd-atlantique",
    role: "doctor",
    name: "Dr. Jean Sossou"
  },
  {
    email: "sonia.gbaguidi@sante.bj",
    password: "123456",
    hospitalId: "hz-calavi",
    role: "admin",
    name: "Sonia Gbaguidi"
  }
];

function normalizeEmail(email: string) {
  return String(email || "").toLowerCase().trim();
}

function formatDateTime(date: Date = new Date()) {
  return `${date.toLocaleDateString("fr-FR")} à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

function createId(prefix: string) {
  return `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
}

function createHash(prefix: string) {
  return `${prefix}_0x${Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`;
}

function createPatientProfile(email: string, extra: Record<string, any> = {}) {
  const normalizedEmail = normalizeEmail(email);
  const baseName = normalizedEmail.split("@")[0].replace(".", " ");
  return {
    name: extra.name || baseName.replace(/\b\w/g, (c: string) => c.toUpperCase()),
    email: normalizedEmail,
    phone: extra.phone || "+229 97 00 00 00",
    walletBalance: Number(extra.walletBalance ?? 10000),
    npi: extra.npi || `10${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    avatar: (extra.name || normalizedEmail).substring(0, 2).toUpperCase()
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());
  app.use((req: any, res: any, next: any) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "santeplus-backend", timestamp: new Date().toISOString() });
  });

  app.get("/api/hospitals", (_req, res) => {
    res.json(HOSPITALS_DB);
  });

  app.post("/api/hospitals/register", (req, res) => {
    const { name, type, address, phone, hours, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Le nom, l'email et le mot de passe sont requis." });
    }

    const normalizedEmail = normalizeEmail(email);
    if (HOSPITAL_USERS_DB.some((u) => u.email === normalizedEmail)) {
      return res.status(400).json({ error: "Cet email est déjà associé à un compte professionnel." });
    }

    const hospitalId = `hosp-${Date.now()}`;
    const newHospital = {
      id: hospitalId,
      name,
      type: type || "clinic",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
      rating: 5.0,
      reviewsCount: 0,
      distance: `${(1 + Math.random() * 5).toFixed(1)} km`,
      address: address || "Abomey-Calavi Centre, Bénin",
      phone: phone || "+229 97 00 00 00",
      hours: hours || "Ouvert 24h/24",
      isVerified: false,
      services: ["Médecine Générale", "Consultations", "Urgences"],
      priceList: [
        { name: "Consultation Médecine Générale", priceXOF: 2000, priceSats: 3330 },
        { name: "Soin Ambulatoire Simple", priceXOF: 1000, priceSats: 1660 }
      ],
      reviews: [],
      coords: { x: 40 + Math.random() * 30, y: 30 + Math.random() * 30 },
      lat: 6.4385 + (Math.random() - 0.5) * 0.05,
      lng: 2.3412 + (Math.random() - 0.5) * 0.05
    };

    HOSPITALS_DB.push(newHospital);
    HOSPITAL_USERS_DB.push({
      email: normalizedEmail,
      password,
      hospitalId,
      role: "admin",
      name: `Admin ${name}`
    });

    res.status(201).json({
      success: true,
      message: "Demande de création d'hôpital enregistrée avec succès. Votre établissement est en attente de confirmation par le Super Administrateur Santé+."
    });
  });

  app.post("/api/hospitals/add", (req, res) => {
    const { name, type, address, phone, hours, email, password } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: "Le nom de l'hôpital est requis." });
    }

    const hospitalId = `hosp-${Date.now()}`;
    const newHospital = {
      id: hospitalId,
      name,
      type: type || "clinic",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
      rating: 5.0,
      reviewsCount: 0,
      distance: `${(1 + Math.random() * 4).toFixed(1)} km`,
      address: address || "Abomey-Calavi Centre, Bénin",
      phone: phone || "+229 97 00 00 00",
      hours: hours || "Ouvert 24h/24",
      isVerified: true,
      services: ["Médecine Générale", "Consultations", "Urgences"],
      priceList: [
        { name: "Consultation Médecine Générale", priceXOF: 2000, priceSats: 3330 },
        { name: "Soin Ambulatoire Simple", priceXOF: 1000, priceSats: 1660 }
      ],
      reviews: [],
      coords: { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 },
      lat: 6.4385 + (Math.random() - 0.5) * 0.04,
      lng: 2.3412 + (Math.random() - 0.5) * 0.04
    };

    HOSPITALS_DB.push(newHospital);

    if (email && password) {
      HOSPITAL_USERS_DB.push({
        email: normalizeEmail(email),
        password,
        hospitalId,
        role: "admin",
        name: `Admin ${name}`
      });
    }

    res.status(201).json({ success: true, hospital: newHospital });
  });

  app.patch("/api/hospitals/:id/verify", (req, res) => {
    const hospital = HOSPITALS_DB.find((item) => item.id === req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: "Établissement non trouvé" });
    }

    hospital.isVerified = true;
    res.json({ success: true, hospital });
  });

  app.post("/api/hospital-users/login", (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = HOSPITAL_USERS_DB.find((entry) => entry.email === normalizedEmail && entry.password === password);

    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    if (user.hospitalId !== "system-admin") {
      const hospital = HOSPITALS_DB.find((entry) => entry.id === user.hospitalId);
      if (hospital && !hospital.isVerified) {
        return res.status(403).json({ error: "Votre établissement est en attente de confirmation par le Super Administrateur Santé+." });
      }
    }

    res.json({
      email: user.email,
      hospitalId: user.hospitalId,
      role: user.role,
      name: user.name
    });
  });

  app.post("/api/hospitals/:id/reviews", (req, res) => {
    const hospital = HOSPITALS_DB.find((item) => item.id === req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: "Hôpital non trouvé" });
    }

    const newReview = {
      id: `rev-${Math.floor(1000 + Math.random() * 9000)}`,
      author: req.body?.author || "Citoyen Anonyme",
      rating: Number(req.body?.rating) || 5,
      date: new Date().toLocaleDateString("fr-FR"),
      comment: req.body?.comment || ""
    };

    hospital.reviews.push(newReview);
    const totalRating = hospital.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    hospital.rating = Number((totalRating / hospital.reviews.length).toFixed(1));
    hospital.reviewsCount = hospital.reviews.length;

    res.json(newReview);
  });

  app.get("/api/appointments", (_req, res) => {
    res.json(APPOINTMENTS_DB);
  });

  app.post("/api/appointments", (req, res) => {
    const { hospitalId, hospitalName, date, timeSlot, patientName } = req.body || {};
    const newAppointment = {
      id: `apt-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId,
      hospitalName,
      date,
      timeSlot,
      patientName,
      status: "confirmed"
    };

    APPOINTMENTS_DB.push(newAppointment);
    res.status(201).json(newAppointment);
  });

  app.delete("/api/appointments/:id", (req, res) => {
    const initialLength = APPOINTMENTS_DB.length;
    APPOINTMENTS_DB = APPOINTMENTS_DB.filter((apt) => apt.id !== req.params.id);

    if (APPOINTMENTS_DB.length === initialLength) {
      return res.status(404).json({ error: "Rendez-vous introuvable" });
    }

    res.json({ success: true, message: "Rendez-vous annulé avec succès" });
  });

  app.post("/api/wallet/patients", (req, res) => {
    const { email, name, phone, npi, walletBalance } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "L'email est requis." });
    }

    const normalizedEmail = normalizeEmail(email);
    const profileData = createPatientProfile(normalizedEmail, { name, phone, npi, walletBalance });
    PATIENTS_DB[normalizedEmail] = profileData;
    res.json(profileData);
  });

  app.get("/api/wallet/patients/:email", (req, res) => {
    const normalizedEmail = normalizeEmail(req.params.email);
    if (!PATIENTS_DB[normalizedEmail]) {
      PATIENTS_DB[normalizedEmail] = createPatientProfile(normalizedEmail);
    }
    res.json(PATIENTS_DB[normalizedEmail]);
  });

  app.post("/api/wallet/patients/:email/deposit", (req, res) => {
    const normalizedEmail = normalizeEmail(req.params.email);
    const patient = PATIENTS_DB[normalizedEmail];
    if (!patient) {
      return res.status(404).json({ error: "Citoyen non trouvé" });
    }

    const delta = Number(req.body?.amountXOF);
    if (!Number.isFinite(delta)) {
      return res.status(400).json({ error: "Montant de recharge invalide" });
    }

    if (delta < 0 && patient.walletBalance + delta < 0) {
      return res.status(400).json({ error: `Solde insuffisant dans votre portefeuille Santé+ (${patient.walletBalance} XOF dispos)` });
    }

    patient.walletBalance += delta;

    if (req.body?.operator === "mtn" || req.body?.operator === "moov") {
      return res.json({
        ...patient,
        integration: "izichange",
        operator: String(req.body.operator).toUpperCase(),
        txId: `izichg_tx_${Math.floor(100000 + Math.random() * 900000)}`,
        status: delta >= 0 ? "success_synced" : "debit_synced"
      });
    }

    res.json(patient);
  });

  app.post("/api/payments/create-lightning-invoice", (req, res) => {
    const amountXOF = Number(req.body?.amountXOF);
    if (!Number.isFinite(amountXOF) || amountXOF <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const amountSats = Math.round(amountXOF * XOF_TO_SATS);
    const invoiceId = `LN-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const bolt11 = `lnbc${amountSats}u1p392066pp5y6m8a6uclm0aqlu7r96paxd0zcrsqm3sff4pghu5r3qpsms9p57qdqg2fhk6mmpwq5kget8wf5k2cmzv9hkutssw3skget8v4cxjumn94sk2uewdqh8gmpwd3jxc6tvd3hxw3scqpvqyjw5qcqpxrzjqw72q3ksla762hsp48qaswep7mqcxw6mppv6mpwpwqf7mpws9p4xpwpvq5qshxztf9f8gskqfq9gqkcxsqypqxpqxzszqxpqw7p9sk7tve9ekymv9cxqpxrzjqw72q3ksla762hsp48qaswep7mqcxw6mppv6mpwpwqf7mpws9p4xpwpvq5qshxztf9f8gskqfq9gqkcxsqypqxpqxzszqxpqw7p9`;

    LIGHTNING_INVOICES_DB[invoiceId] = {
      id: invoiceId,
      amountXOF,
      amountSats,
      bolt11,
      isPaid: false,
      txHash: createHash("ln_tx"),
      createdAt: Date.now()
    };

    setTimeout(() => {
      if (LIGHTNING_INVOICES_DB[invoiceId]) {
        LIGHTNING_INVOICES_DB[invoiceId].isPaid = true;
      }
    }, 5000);

    res.json({ invoice: bolt11, invoiceId, amountSats, status: "pending_breez_routing" });
  });

  app.get("/api/payments/verify-lightning-invoice", (req, res) => {
    const invoiceId = String(req.query.invoiceId || "");
    if (!invoiceId) {
      return res.status(400).json({ error: "ID d'invoice manquant" });
    }

    const invoice = LIGHTNING_INVOICES_DB[invoiceId];
    if (!invoice) {
      return res.status(404).json({ error: "Invoice non trouvée" });
    }

    if (invoice.isPaid) {
      const pendingInvoice = INVOICES_DB.find((entry) => entry.totalXOF === invoice.amountXOF && !entry.isPaid);
      if (pendingInvoice) {
        pendingInvoice.isPaid = true;
        pendingInvoice.paymentMethod = "Lightning";
        pendingInvoice.txHash = invoice.txHash;
      }
    }

    res.json({ isPaid: invoice.isPaid, txHash: invoice.txHash, invoiceId: invoice.id });
  });

  app.get("/api/invoices", (_req, res) => {
    res.json(INVOICES_DB);
  });

  app.post("/api/invoices", (req, res) => {
    const { patientName, patientPhone, hospitalName, hospitalAddress, items, totalXOF, paymentMethod, doctorName, isPaid } = req.body || {};
    const invoiceId = `FACT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInvoice = {
      id: invoiceId,
      patientName,
      patientPhone: patientPhone || "+229 97 88 55 44",
      hospitalName,
      hospitalAddress,
      date: new Date().toLocaleDateString("fr-FR") + " à " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      items: items || [],
      totalXOF: Number(totalXOF) || 0,
      totalSats: Math.round((Number(totalXOF) || 0) * XOF_TO_SATS),
      paymentMethod: paymentMethod || "Wallet",
      txHash: createHash("tx"),
      isPaid: !!isPaid,
      doctorName: doctorName || "Dr. Sossou"
    };

    INVOICES_DB.push(newInvoice);
    res.status(201).json(newInvoice);
  });

  app.post("/api/invoices/:id/pay", (req, res) => {
    const invoice = INVOICES_DB.find((entry) => entry.id === req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    if (invoice.isPaid) {
      return res.status(400).json({ error: "Cette facture est déjà réglée" });
    }

    const normalizedEmail = normalizeEmail(req.body?.email);
    const patient = PATIENTS_DB[normalizedEmail];
    if (!patient) {
      return res.status(404).json({ error: "Patient non trouvé" });
    }

    if (patient.walletBalance < invoice.totalXOF) {
      return res.status(400).json({ error: `Solde insuffisant dans votre portefeuille Santé+ (${patient.walletBalance} XOF dispos vs ${invoice.totalXOF} XOF requis)` });
    }

    patient.walletBalance -= invoice.totalXOF;
    invoice.isPaid = true;
    invoice.paymentMethod = "Wallet";
    invoice.txHash = createHash("tx_wallet");

    res.json({ invoice, patient });
  });

  app.post("/api/invoices/:id/pay-lightning", (req, res) => {
    const invoice = INVOICES_DB.find((entry) => entry.id === req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    invoice.isPaid = true;
    invoice.paymentMethod = "Lightning";
    invoice.txHash = createHash("ln_tx");

    res.json(invoice);
  });

  app.get("/api/access-requests", (_req, res) => {
    res.json(ACCESS_REQUESTS_DB);
  });

  app.post("/api/access-requests", (req, res) => {
    const { npi, doctorEmail, hospitalName } = req.body || {};
    const newRequest = {
      id: `req-${Math.floor(100 + Math.random() * 900)}`,
      npi,
      doctorEmail,
      hospitalName,
      status: "pending",
      requestedAt: formatDateTime()
    };

    ACCESS_REQUESTS_DB.push(newRequest);
    res.status(201).json(newRequest);
  });

  app.patch("/api/access-requests/:id/status", (req, res) => {
    const request = ACCESS_REQUESTS_DB.find((entry) => entry.id === req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Demande d'accès introuvable" });
    }

    request.status = req.body?.status;
    res.json(request);
  });

  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Le message est requis." });
    }

    const msg = String(message).toLowerCase();
    let reply = "";

    if (msg.includes("facture") || msg.includes("payer") || msg.includes("recharge") || msg.includes("solde") || msg.includes("argent")) {
      reply = "Sur Santé+ Bénin, vos factures de soins sont réglées en FCFA (via le solde rechargé de votre portefeuille) ou en Satoshis via le Réseau Lightning (Bitcoin). Une fois payée, la facture reçoit immédiatement un tampon rouge officiel **★ PAYÉ & CERTIFIÉ ★** du Ministère de la Santé et affiche un QR Code. Ce QR Code permet une vérification 100% hors-ligne (offline) par scan de vos papiers officiels.";
    } else if (msg.includes("rendez") || msg.includes("rdv") || msg.includes("docteur") || msg.includes("médecin") || msg.includes("service")) {
      reply = "Pour prendre rendez-vous chez Santé+ : vous devez obligatoirement sélectionner le **Service médical** ainsi que la **Cause/Raison** de votre visite. Le choix d'un **Docteur spécifique** est quant à lui optionnel (vous pouvez le laisser vide si vous n'avez pas de préférence).";
    } else if (msg.includes("autorisation") || msg.includes("signer") || msg.includes("blockchain") || msg.includes("dossier") || msg.includes("lightning") || msg.includes("empreinte") || msg.includes("visage") || msg.includes("ident")) {
      reply = "La sécurité de Santé+ est décentralisée et respecte votre vie privée. Vous n'avez **aucun besoin de reconnaissance faciale ou d'empreinte digitale**. À la place, un bouton clair vous permet de signer vos autorisations de dossier médical à l'aide de votre clé privée du **Réseau Lightning (LN Sign)**. C'est instantané, visible et inviolable.";
    } else if (msg.includes("scan") || msg.includes("papier") || msg.includes("vérification") || msg.includes("hors ligne") || msg.includes("offline")) {
      reply = "La vérification des papiers et dossiers médicaux est conçue pour fonctionner **uniquement par scan hors ligne**. Les informations du patient sont générées en texte brut dans le QR code pour un transfert direct de mobile à mobile, sans être publiées ou hébergées en ligne sur internet pour garantir une confidentialité totale.";
    } else if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello")) {
      reply = "Bonjour ! Je suis l'Assistant Virtuel de Santé+ Bénin. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur les factures, les rendez-vous, la signature Lightning Network ou la vérification offline par scan !";
    } else {
      reply = "Je suis l'Assistant Santé+ Bénin. Je peux vous expliquer comment fonctionnent nos services : \n- **Factures** : Tampon PAYÉ officiel, QR Code offline.\n- **Rendez-vous** : Service et motif requis, docteur optionnel.\n- **Sécurité** : Signature cryptographique Lightning (LN Sign), sans biométrie (ni visage, ni empreinte).\n- **Scan** : Vérification des papiers 100% hors-ligne.\n\nQue souhaitez-vous savoir en particulier ?";
    }

    res.json({ text: reply, source: "local" });
  });

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Santé+ Benin Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
