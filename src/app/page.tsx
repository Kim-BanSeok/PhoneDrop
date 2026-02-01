'use client'

import { useState } from 'react'
import Header from '@/components/sections/Header'
import TabNavigation from '@/components/sections/TabNavigation'
import Footer from '@/components/sections/Footer'
import { type Contact } from '@/lib/vcard'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <TabNavigation contacts={contacts} onContactsUpdate={setContacts} />
      <Footer />
    </main>
  )
}
