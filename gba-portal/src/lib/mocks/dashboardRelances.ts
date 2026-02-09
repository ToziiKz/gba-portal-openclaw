export type ReminderKind = "licence" | "equipment";

export type ReminderPole = "École de foot" | "Pré-formation" | "Formation";

export type ReminderChannel = "email" | "sms" | "whatsapp";

export type DashboardReminderRow = {
  id: string;
  kind: ReminderKind;
  pole: ReminderPole;
  category: string;
  team: string;
  playerName: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  channelHint: ReminderChannel;
  lastActionLabel: string;
  /** licence */
  amountDueEur?: number;
  dueDateLabel?: string;
  /** equipment */
  equipmentTodoLabel?: string;
  note?: string;
};

export const reminderPoles: ReminderPole[] = ["École de foot", "Pré-formation", "Formation"];

export const reminderKinds: Array<{ id: ReminderKind | "all"; label: string; note: string }> = [
  { id: "all", label: "Tous", note: "licences + équipements" },
  { id: "licence", label: "Licences", note: "à encaisser / en retard" },
  { id: "equipment", label: "Équipements", note: "tailles / remise" },
];

export const dashboardRemindersMock: DashboardReminderRow[] = [
  {
    id: "rem-lic-001",
    kind: "licence",
    pole: "Pré-formation",
    category: "U13",
    team: "GBA U13 A",
    playerName: "Enzo Martin",
    contactName: "Mme Martin",
    contactEmail: "martin.parent@example.com",
    contactPhone: "+33 6 11 22 33 44",
    channelHint: "email",
    amountDueEur: 90,
    dueDateLabel: "15/10",
    lastActionLabel: "—",
    note: "Acompte reçu en septembre (mock).",
  },
  {
    id: "rem-lic-002",
    kind: "licence",
    pole: "École de foot",
    category: "U9",
    team: "GBA U9",
    playerName: "Lina Diallo",
    contactName: "M. Diallo",
    contactEmail: "diallo.parent@example.com",
    contactPhone: "+33 6 55 66 77 88",
    channelHint: "sms",
    amountDueEur: 120,
    dueDateLabel: "01/10",
    lastActionLabel: "Relance envoyée (mock) · il y a 3j",
  },
  {
    id: "rem-lic-003",
    kind: "licence",
    pole: "Formation",
    category: "U17",
    team: "GBA U17",
    playerName: "Yanis Benali",
    contactName: "Mme Benali",
    contactEmail: null,
    contactPhone: "+33 7 00 00 00 01",
    channelHint: "whatsapp",
    amountDueEur: 60,
    dueDateLabel: "05/11",
    lastActionLabel: "—",
  },
  {
    id: "rem-eq-001",
    kind: "equipment",
    pole: "École de foot",
    category: "U11",
    team: "GBA U11",
    playerName: "Tom Leroy",
    contactName: "M. Leroy",
    contactEmail: "leroy.parent@example.com",
    contactPhone: "+33 6 10 10 10 10",
    channelHint: "email",
    equipmentTodoLabel: "Taille maillot manquante + chaussettes à remettre",
    lastActionLabel: "—",
    note: "À valider avant remise (mock).",
  },
  {
    id: "rem-eq-002",
    kind: "equipment",
    pole: "Pré-formation",
    category: "U15",
    team: "GBA U15",
    playerName: "Ilyes Haddad",
    contactName: "Mme Haddad",
    contactEmail: "haddad.parent@example.com",
    contactPhone: "+33 6 99 88 77 66",
    channelHint: "whatsapp",
    equipmentTodoLabel: "Veste (taille L ?) non remise",
    lastActionLabel: "—",
  },
  {
    id: "rem-eq-003",
    kind: "equipment",
    pole: "Formation",
    category: "U18",
    team: "GBA U18",
    playerName: "Lucas Bernard",
    contactName: "M. Bernard",
    contactEmail: null,
    contactPhone: "+33 6 01 02 03 04",
    channelHint: "sms",
    equipmentTodoLabel: "Short (taille M) à remettre",
    lastActionLabel: "Remise planifiée (mock) · demain",
  },
];
