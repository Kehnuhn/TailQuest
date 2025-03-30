import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to TailQuest</h1>
      {!session ? (
        <button onClick={() => signIn("discord")}>Login with Discord</button>
      ) : (
        <>
          <p>Logged in as: {session.user?.name}</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      )}
    </div>
  );
}
