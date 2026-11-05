// THE HOME PAGE: SECTION ORDER ONLY. EVERY SECTION IS ITS OWN COMPONENT.
import { Cta } from '../sections/home/cta'
import { Faq, type FaqItem } from '../sections/home/faq'
import { Hero } from '../sections/home/hero'
import { Guides } from '../sections/home/guides'
import { How } from '../sections/home/how'
import { Pricing } from '../sections/home/pricing'
import { Reviews } from '../sections/home/reviews'
import { Sample } from '../sections/home/sample'
import { Trust } from '../sections/home/trust'
import { Uses } from '../sections/home/uses'
import { Why } from '../sections/home/why'

export const HomePage = ({ today, faq }: { today: string; faq: FaqItem[] }) => (
  <>
    <Hero today={today} />
    <Trust />
    <How />
    <Sample />
    <Pricing />
    <Why />
    <Uses />
    <Reviews />
    <Guides />
    <Faq items={faq} />
    <Cta />
  </>
)
