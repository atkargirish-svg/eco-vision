import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Factory,
  Cpu,
  FileText,
  ArrowRight,
  Repeat,
  Wrench,
  Percent,
  Briefcase,
} from 'lucide-react';
import { Logo } from '@/components/common/logo';

const featureCards = [
  {
    icon: <Factory className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />,
    title: 'Data Collection',
    description: "Easily input your factory's electricity usage, fuel consumption, and production data.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />,
    title: 'AI Pattern Analysis',
    description: 'Our AI analyzes peak usage, idle time, and inefficiencies to find savings.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />,
    title: 'Smart Recommendations',
    description: 'Get actionable suggestions with estimated emission reduction percentages.',
  },
];

const benefits = [
  'Reduce CO₂ emissions and fight global warming',
  'Lower electricity and fuel costs',
  'Improve machine efficiency and productivity',
  'Achieve green certifications and boost brand reputation',
  'Attract eco-conscious clients',
  'Prepare for future carbon regulations',
];

const revenueStreams = [
  {
    icon: <Repeat className="h-8 w-8 text-primary" />,
    title: 'Subscription Model',
    description: 'Charge factories a monthly or annual fee to use the AI platform, ensuring a steady, predictable income stream.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Carbon Report Fees',
    description: 'Generate revenue by charging for verified emission reports, which are essential for compliance and green certifications.',
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: 'Setup & Onboarding Fee',
    description: 'Implement a one-time charge for system installation, configuration, and training to ensure seamless adoption by clients.',
  },
  {
    icon: <Percent className="h-8 w-8 text-primary" />,
    title: 'Energy Savings Commission',
    description: 'Create a win-win model by taking a percentage of the actual cost savings that factories achieve through your optimizations.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Consultancy & Licensing',
    description: 'Expand your reach by licensing the software to industrial consultants and partners, creating a scalable B2B channel.',
  },
];

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 overflow-hidden">
           <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/veo/veo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="container relative mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight bg-gradient-to-b from-amber-400 to-amber-900 bg-clip-text text-transparent drop-shadow-md sm:text-5xl md:text-6xl animate-in fade-in slide-in-from-top-12 duration-700">
              Affordable Carbon Intelligence for Small Industries
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)] md:text-xl animate-in fade-in slide-in-from-top-12 duration-700 delay-200">
              A software-based AI platform that estimates and reduces carbon emissions using your existing energy data—no expensive hardware required.
            </p>
            <div className="mt-10 animate-in fade-in slide-in-from-top-12 duration-700 delay-400">
              <Button size="lg" asChild>
                <Link href="/login">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-background py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-10 duration-500" style={{ animationDelay: '300ms' }}>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple, four-step process to make your factory greener and more efficient.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {featureCards.map((feature, index) => (
                <Card key={feature.title} className="group transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary animate-in fade-in slide-in-from-bottom-12 duration-500" style={{ animationDelay: `${500 + index * 150}ms` }}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-secondary/50 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-10 duration-500" style={{ animationDelay: '1000ms' }}>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Unlock Environmental and Business Benefits
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Reducing your carbon footprint is not just good for the planet—it's good for your bottom line.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-12 duration-500" style={{ animationDelay: `${1200 + index * 75}ms` }}>
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="business-model" className="bg-background py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-10 duration-500" style={{ animationDelay: '1800ms' }}>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Flexible Business Models
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                EcoVision is designed with multiple revenue streams for sustainable growth and profitability.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {revenueStreams.map((stream, index) => (
                <Card key={stream.title} className="flex flex-col transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${2000 + index * 150}ms` }}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {stream.icon}
                      <CardTitle className="font-headline text-2xl">{stream.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{stream.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto border-t px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EcoVision. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
