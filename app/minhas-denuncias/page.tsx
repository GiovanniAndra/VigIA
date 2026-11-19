import { redirect } from 'next/navigation'

export default function MyReportsRoute() {
  redirect('/?section=my-reports')
}
