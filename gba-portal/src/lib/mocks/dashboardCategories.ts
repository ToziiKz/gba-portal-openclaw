export type CategoryPole = 'École de foot' | 'Pré-formation' | 'Formation' | 'Seniors'

export type DashboardCategory = {
  id: string
  name: string
  pole: CategoryPole
  ageRangeLabel: string
  teamsLabel: string
  teamsCount: number
  playersEstimate: number
  leadStaff: {
    id: string
    name: string
    role: 'resp-categorie' | 'coord' | 'coach'
  }[]
  updatedAtLabel: string
  notes?: string
}

export const dashboardCategoryPoles: CategoryPole[] = [
  'École de foot',
  'Pré-formation',
  'Formation',
  'Seniors',
]

export const dashboardCategoriesMock: DashboardCategory[] = [
  {
    id: 'cat-u6u9',
    name: 'U6 → U9',
    pole: 'École de foot',
    ageRangeLabel: '2017–2020',
    teamsLabel: 'U6, U7, U8, U9',
    teamsCount: 4,
    playersEstimate: 62,
    leadStaff: [
      { id: 'st-cat-001', name: 'N. Bernard', role: 'coord' },
      { id: 'st-cat-002', name: 'L. Leroy', role: 'coach' },
    ],
    updatedAtLabel: 'hier',
    notes: 'Point clé: onboarding des nouveaux (accueil + dotations).',
  },
  {
    id: 'cat-u10u11',
    name: 'U10 → U11',
    pole: 'École de foot',
    ageRangeLabel: '2015–2016',
    teamsLabel: 'U10, U11',
    teamsCount: 2,
    playersEstimate: 34,
    leadStaff: [{ id: 'st-cat-003', name: 'S. Kader', role: 'resp-categorie' }],
    updatedAtLabel: 'il y a 3j',
  },
  {
    id: 'cat-u12u13',
    name: 'U12 → U13',
    pole: 'Pré-formation',
    ageRangeLabel: '2013–2014',
    teamsLabel: 'U12, U13',
    teamsCount: 2,
    playersEstimate: 28,
    leadStaff: [
      { id: 'st-cat-004', name: 'M. Diallo', role: 'resp-categorie' },
      { id: 'st-cat-005', name: 'C. Petit', role: 'coach' },
    ],
    updatedAtLabel: 'aujourd’hui',
  },
  {
    id: 'cat-u14u15',
    name: 'U14 → U15',
    pole: 'Pré-formation',
    ageRangeLabel: '2011–2012',
    teamsLabel: 'U14, U15',
    teamsCount: 2,
    playersEstimate: 26,
    leadStaff: [{ id: 'st-cat-006', name: 'A. Morel', role: 'coord' }],
    updatedAtLabel: 'semaine dernière',
  },
  {
    id: 'cat-u16u18',
    name: 'U16 → U18',
    pole: 'Formation',
    ageRangeLabel: '2008–2010',
    teamsLabel: 'U16, U17, U18',
    teamsCount: 3,
    playersEstimate: 40,
    leadStaff: [
      { id: 'st-cat-007', name: 'P. Martin', role: 'resp-categorie' },
      { id: 'st-cat-008', name: 'R. Thomas', role: 'coach' },
    ],
    updatedAtLabel: 'il y a 2j',
    notes: 'À venir: suivi présences + sélections / détections.',
  },
  {
    id: 'cat-seniors',
    name: 'Seniors',
    pole: 'Seniors',
    ageRangeLabel: '2007 et +',
    teamsLabel: 'R1, R3, Loisirs (mock)',
    teamsCount: 3,
    playersEstimate: 55,
    leadStaff: [{ id: 'st-cat-009', name: 'D. Garcia', role: 'coord' }],
    updatedAtLabel: 'il y a 5j',
  },
]
