
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface Quest {
  id: string;
  objective: string;
  description: string;
  roles: { [key: string]: number };
  leadership_roles: string[];
  time: string | null;
  created_at: string;
  created_by: string;
}

const allRoles = [
  "PowerDPS", "CondiDPS", "AlacrityDPS", "QuicknessDPS",
  "AlacrityHeal", "QuicknessHeal", "AlacrityTank", "QuicknessTank",
  "Kiter", "Special Role(s)", "Other"
];
const leadershipRoles = ["Commander", "Lieutenant", "Mentor"];

export default function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [showJoinForm, setShowJoinForm] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const superAdminUsername = "kehnuhn";

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

  const joinQuest = async (questId: string) => {
    const username = session?.user?.name ?? "Unknown Adventurer";

    const { data, error } = await supabase.from("participants").insert([
      {
        quest_id: questId,
        user_name: username,
        roles: selectedRoles,
        leadership_roles: selectedLeads
      }
    ]);

    if (error) {
      console.error("Error joining quest:", error);
      alert("Failed to join quest.");
    } else {
      alert("Successfully joined the quest!");
      setShowJoinForm(null);
      setSelectedRoles([]);
      setSelectedLeads([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Quest Board</h1>
      {quests.map((quest) => (
        <div key={quest.id} className="border border-yellow-400 p-4 mb-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">{quest.objective}</h2>
          <p className="mb-2">{quest.description}</p>
          <p className="mb-2 text-sm italic">Created by: {quest.created_by}</p>
          <p className="mb-2 text-sm">{quest.time ? `Scheduled: ${quest.time}` : "No time set"}</p>

          <button
            onClick={() =>
              setShowJoinForm(showJoinForm === quest.id ? null : quest.id)
            }
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 mb-2"
          >
            {showJoinForm === quest.id ? "Cancel" : "Join Quest"}
          </button>

          {showJoinForm === quest.id && (
            <div className="bg-yellow-900 text-white p-4 mt-4 rounded">
              <div className="mb-2">
                <strong>Select Roles:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {allRoles.map((role) => (
                    <label key={role}>
                      <input
                        type="checkbox"
                        value={role}
                        checked={selectedRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoles([...selectedRoles, role]);
                          } else {
                            setSelectedRoles(selectedRoles.filter((r) => r !== role));
                          }
                        }}
                      />{" "}
                      {role}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-2 mt-4">
                <strong>Select Leadership Roles:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {leadershipRoles.map((role) => (
                    <label key={role}>
                      <input
                        type="checkbox"
                        value={role}
                        checked={selectedLeads.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, role]);
                          } else {
                            setSelectedLeads(selectedLeads.filter((r) => r !== role));
                          }
                        }}
                      />{" "}
                      {role}
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={() => joinQuest(quest.id)}
                className="bg-green-500 text-black px-4 py-2 rounded mt-4 hover:bg-green-400"
              >
                Confirm Join
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
