'use client'

import { useState } from 'react'
import Header from '@/components/sections/Header'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import WhyPhoneDropSection from '@/components/sections/WhyPhoneDropSection'
import TabNavigation from '@/components/sections/TabNavigation'
import Footer from '@/components/sections/Footer'
import { type Contact } from '@/lib/vcard'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <WhyPhoneDropSection />
      <TabNavigation contacts={contacts} onContactsUpdate={setContacts} />
      <Footer />
    </main>
  )
}
