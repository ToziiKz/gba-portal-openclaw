import { getCategories } from './actions'
import CategoriesClient from './CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function DashboardCategoriesPage() {
  const categories = await getCategories()

  return <CategoriesClient initialCategories={categories} />
}
