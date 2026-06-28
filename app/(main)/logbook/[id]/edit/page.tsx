import { redirect } from 'next/navigation'
import { fetchSighting } from '@/lib/collector'
import EditSightingForm from './EditSightingForm'

export default async function EditSightingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sighting = await fetchSighting(id)

  if (!sighting) {
    redirect('/login')
  }

  return <EditSightingForm sighting={sighting} />
}
