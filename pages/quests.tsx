import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface Quest {
  id: string;
  objective: string;
  description: string;
  roles: string[];
  leadership_roles: string[];
  time: string | null;
  created_at: string;
  created_by: string;
  participants: string[]; // Correctly typed as an array of strings
}

export default function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchQuests = async () => {
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading quests:", error);
      else setQuests(data);
    };

    fetchQuests();
  }, []);

  // Join quest functionality
  const joinQuest = async (questId: string) => {
    if (!session?.user) {
      alert("You need to be logged in to join a quest!");
      return;
    }

    const { data, error } = await supabase
      .rpc("append_participant", {
        quest_id: questId,
        participant: session.user.name,
      });

    if (error) {
      console.error("Error joining quest:", error);
      alert("Failed to join quest.");
    } else {
      alert("Successfully joined the quest!");

      // Update the state, making sure participants is always an array of strings
      setQuests(quests.map((quest) =>
        quest.id === questId
          ? { ...quest, participants: (quest.participants || []).filter(Boolean) } // Remove null/undefined
          : quest
      ));
    }
  };

  // Delete quest functionality
  const deleteQuest = async (id: string) => {
    const { error } = await supabase.from("quests").delete().eq("id", id);
    if (error) {
      console.error("Error deleting quest:", error);
      alert("Error deleting quest.");
    } else {
      setQuests(quests.filter((quest) => quest.id !== id));
    }
  };

  // Log session user name and quest creator for debugging
  useEffect(() => {
    if (session?.user) {
      console.log("Session User ID:", session.user.id); // Log session user ID
    }
    quests.forEach((quest) => {
      console.log("Quest Created By (User ID):", quest.created_by); // Log quest creator ID
    });
  }, [session, quests]);

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-6 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quest Board</h1>
        <div className="flex items-center gap-4">
          {session?.user?.name && (
            <span className="text-yellow-300">Hi, {session.user.name}</span>
          )}
          <button
            onClick={() => router.push("/post")}
            className="px-4 py-2 bg-yellow-600 text-black rounded-xl hover:bg-yellow-500"
          >
            Post Quest
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-yellow-700 text-black rounded-xl hover:bg-yellow-600"
          >
            Logout
          </button>
        </div>
      </div>

      {quests.length === 0 ? (
        <p className="text-center text-yellow-300">No quests posted yet.</p>
      ) : (
        <div className="space-y-6">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="bg-gray-900 p-4 rounded-xl border border-yellow-700 shadow-md"
            >
              <h2 className="text-2xl font-bold text-yellow-300">{quest.objective}</h2>
              <p className="mb-2 text-sm text-yellow-500">Posted: {new Date(quest.created_at).toLocaleString()}</p>
              {quest.time && (
                <p className="mb-2 text-yellow-500">Time: {new Date(quest.time).toLocaleString()}</p>
              )}
              <p className="mb-4 text-yellow-200">{quest.description}</p>
              <div className="flex flex-wrap gap-2">
                {quest.roles?.map((role, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-yellow-700 text-black text-sm rounded-full shadow"
                  >
                    {role}
                  </span>
                ))}
                {quest.leadership_roles?.map((role, i) => (
                  <span
                    key={i + 1000}
                    className="px-3 py-1 bg-yellow-500 text-black text-sm rounded-full shadow border border-black"
                  >
                    {role}
                  </span>
                ))}
              </div>
              {quest.participants && !quest.participants.includes(session?.user?.name || "") && (
                <button
                  onClick={() => joinQuest(quest.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 mt-4"
                >
                  Join Quest
                </button>
              )}

              {quest.participants && quest.participants.includes(session?.user?.name || "") && (
                <span className="text-yellow-300 mt-4">You have joined this quest!</span>
              )}

              {/* Conditional rendering for Delete button */}
              {session?.user?.id === quest.created_by && (
                <button
                  onClick={() => deleteQuest(quest.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 mt-4"
                >
                  Delete Quest
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
