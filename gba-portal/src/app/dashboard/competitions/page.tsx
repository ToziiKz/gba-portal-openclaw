import { getCompetitions } from './actions'
import CompetitionsClient from './CompetitionsClient'

export const dynamic = 'force-dynamic'

export default async function CompetitionsPage() {
  const competitions = await getCompetitions()

  return <CompetitionsClient initialCompetitions={competitions} />
}
