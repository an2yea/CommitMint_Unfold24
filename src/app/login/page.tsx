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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGoogleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <motion.div
                    className="h-5 w-5 rounded-full border-t-2 border-r-2 border-background"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
            <div className="mt-4 flex items-center">
              <div className="border-t flex-grow"></div>
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <div className="border-t flex-grow"></div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}