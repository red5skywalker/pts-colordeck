import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign In — Color Deck' }

export default function LoginPage() {
  return <LoginForm />
}
