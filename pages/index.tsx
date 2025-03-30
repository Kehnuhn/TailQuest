import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{
      backgroundColor: "#000",
      color: "#FFD700",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Welcome to TailQuest</h1>
      {!session ? (
        <button
          onClick={() => signIn("discord")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FFD700",
            color: "#000",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login with Discord
        </button>
      ) : (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Logged in as: <strong>{session.user?.name}</strong>
          </p>
          <button
            onClick={() => signOut()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#FFD700",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
