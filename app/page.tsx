import { redirect } from 'next/navigation'

// Root redirect → feed
export default function RootPage() {
  redirect('/feed')
}
