'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, TrendingUp, Shield, Users, Zap, Github, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useInView } from 'react-intersection-observer'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX }}
      />
      
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/home" className="text-2xl font-bold text-primary">
            CommitMint
          </Link>
          <div className="space-x-4">
            <Link href="/login" className="text-foreground hover:text-primary transition-colors">
              Login
            </Link>
            <Button asChild>
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <AboutUsSection />
        <WhyUseSection />
        <FinalCTA />
      </main>

      <footer className="bg-background text-foreground py-4 border-t">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <p>&copy; 2024 CommitMint. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <span>Made with </span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by team Aviato</span>
            <a href="https://github.com/yourusername/commitMint" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="py-16 md:py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transform Your Habits, <span className="text-primary">Transform Your Life</span>
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          CommitMint helps you build lasting habits through accountability and rewards.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild size="lg" className="hover:animate-none">
            <Link href="/login">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { title: "Set Achievable Goals", description: "Break down your aspirations into manageable daily habits.", icon: Check },
    { title: "Track Your Progress", description: "Visualize your growth with intuitive charts and statistics.", icon: TrendingUp },
    { title: "Stay Accountable", description: "Stake real money to keep yourself motivated and committed.", icon: Shield },
    { title: "Join a Community", description: "Connect with like-minded individuals on similar journeys.", icon: Users },
  ]

  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section className="py-16 bg-secondary/20" ref={ref}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Powerful Features to Build Better Habits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-transform hover:scale-105">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutUsSection() {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/1 mb-8 md:mb-0"
            initial="hidden"
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -50 }
            }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">About CommitMint</h2>
            <p className="text-lg mb-4 text-muted-foreground text-center">
              We believe that small, consistent actions lead to remarkable transformations. CommitMint was born from the idea that with the right tools and motivation, anyone can build life-changing habits. Our platform combines behavioral science, gamification, and community support to help you stay on track and achieve your goals.
            </p>
          </motion.div>
          <motion.div
            className="md:w-1"
            initial="hidden"
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: 50 }
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WhyUseSection() {
  const reasons = [
    "Scientifically-backed habit formation techniques",
    "Flexible goal-setting to fit your lifestyle",
    "Real monetary incentives for staying committed",
    "Supportive community of habit-builders",
    "Detailed analytics to track your progress",
    "Customizable reminders and notifications",
  ]

  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section className="py-20 bg-secondary/20" ref={ref}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Use CommitMint?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="flex items-start"
              initial="hidden"
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Zap className="h-6 w-6 text-primary mr-4 flex-shrink-0 mt-1" />
              <p className="text-lg">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial="hidden"
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          transition={{ duration: 0.5 }}
        >
          Ready to Transform Your Habits?
        </motion.h2>
        <motion.p
          className="text-xl mb-8 text-muted-foreground"
          initial="hidden"
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join thousands of others who are already building better lives, one habit at a time.
        </motion.p>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild size="lg" className="animate-bounce hover:animate-none">
            <Link href="/login">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

