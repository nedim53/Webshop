"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Preusmjeravanje...</div>
    </div>
  );
}
