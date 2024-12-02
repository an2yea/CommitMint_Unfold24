// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import Image from 'next/image'
import { GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useOkto, OktoContextType } from 'okto-sdk-react';

export default function LoginPage(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const { authenticate } = useOkto() as OktoContextType;
  const router = useRouter();

  const handleGoogleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      

      try {
        const idToken = credential?.idToken;
        await authenticate(idToken as string, async (authResponse: any, error: any) => {
        if (authResponse) {
          console.log("Authentication successful", authResponse);
        } else if (error) {
          console.error("Error authenticating with Okto", error);
        } 
        });

      } catch (error) {
        console.error("Error getting user ID token", error);
      }


      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to CommitMint </CardTitle>
            <CardDescription className="text-center">
              Sign in to start your habit-building journey!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full py-6 text-lg font-semibold"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                  className="h-5 w-5 rounded-full border-t-2 border-r-2 border-black"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Continue with Google
                  </>
                )}
              </Button>
            </div>
            {/* <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
            </div> */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <span className="text-sm text-muted-foreground">Powered by</span>
                <Image src="/okto.png" alt="Okto Logo" width={60} height={24} />
              <span className="text-sm text-muted-foreground"></span>
                <Image src="/aptos.png" alt="Aptos Logo" width={42} height={18} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}