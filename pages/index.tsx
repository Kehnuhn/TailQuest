import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && router.pathname === "/") {
      router.push("/quests");
    }
  }, [session, router]);

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center">
      <button
        onClick={() => signIn("discord")}
        className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-400"
      >
        Login with Discord
      </button>
    </div>
  );
}