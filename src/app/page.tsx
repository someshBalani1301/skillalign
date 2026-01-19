import {
  Header,
  Hero,
  Stats,
  Features,
  Pricing,
  CallToAction,
  Footer,
} from "@/components/home";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Pricing />
      <CallToAction />
      <Footer />
    </main>
  );
}
