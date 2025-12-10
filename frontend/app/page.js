"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter("/");

  const signin = () => { router.push("/signin") }
  const signup = () => { router.push("/signup") }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row gap-10 mx-auto">
        <p className="text-foreground">Welcome, View my Authentication component</p>
        <div className="flex gap-8">
          <button 
          onClick={signin} 
          className="bg-main px-6 py-2 rounded-sm text-white"
          >
            Sign in
          </button>
          <button 
          onClick={signup} 
          className="bg-main px-6 py-2 rounded-sm text-white"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
