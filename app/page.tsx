'use client'
import { useLenis } from '@/hooks/useLenis'
import Ignition from '@/components/sections/Ignition'
import Numbers from '@/components/sections/Numbers'
import FiveFlames from '@/components/sections/FiveFlames'
import TheStage from '@/components/sections/TheStage'
import TheCrest from '@/components/sections/TheCrest'
import Battlegrounds from '@/components/sections/Battlegrounds'
import Encore from '@/components/sections/Encore'

export default function Home() {
  // Initialize smooth scrolling + GSAP ScrollTrigger sync
  useLenis()

  return (
    <main>
      <Ignition />
      <Numbers />
      <FiveFlames />
      <TheStage />
      <TheCrest />
      <Battlegrounds />
      <Encore />
    </main>
  )
}
