import Link from "next/link"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blue Ox Group — Software Sales Network",
  description:
    "Blue Ox Group connects software companies with active sales representatives across regions.",
}

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your profile",
    description:
      "Sign up and fill in your details — location, languages, and background. Your profile is visible to Blue Ox Group admins.",
  },
  {
    step: "02",
    title: "Set your availability",
    description:
      "Toggle yourself active when you're available to take on new clients. Go inactive whenever you need a break.",
  },
  {
    step: "03",
    title: "Get connected",
    description:
      "When a product opportunity comes up in your district, admins reach out to the right active rep directly.",
  },
]

const STATS = [
  { label: "Software companies", value: "5+" },
  { label: "Active representatives", value: "Growing" },
  { label: "Regions covered", value: "East Africa" },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center sm:pt-32">
        <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 font-utility text-xs font-medium text-muted-foreground">
          Sales representative network
        </div>
        <h1 className="mb-6 font-display text-5xl uppercase tracking-[0.08em] sm:text-7xl">
          The right rep,
          <br />
          <span className="text-muted-foreground">in the right district.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          Blue Ox Group maintains a directory of active sales professionals across regions.
          When a new product opportunity arises, we know exactly who to call.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" nativeButton={false} render={<Link href="/sign-up" />}>
            Join the network
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/about" />}>
            Learn more
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-display text-4xl tracking-[0.06em]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] sm:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">
            Simple by design — coordination happens where it's fastest.
          </p>
        </div>
        <ol className="grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, title, description }) => (
            <li key={step} className="flex flex-col gap-3">
              <span className="font-utility text-sm font-medium text-muted-foreground">{step}</span>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="mb-4 font-display text-3xl uppercase tracking-[0.08em] sm:text-4xl">
            Ready to join?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Create your profile in minutes. No approval process — just fill in your details and
            set yourself active.
          </p>
          <Button size="lg" nativeButton={false} render={<Link href="/sign-up" />}>
            Get started
          </Button>
        </div>
      </section>
    </>
  )
}
