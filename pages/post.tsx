import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function PostQuest() {
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<string[]>([]); // Explicitly type roles as string[]
  const [leadershipRoles, setLeadershipRoles] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const router = useRouter();

  const handlePostQuest = async () => {
    // Validation
    if (!objective || !description) {
      alert("Objective and description are required.");
      return;
    }

    const { data, error } = await supabase.from("quests").insert([
      {
        objective,
        description,
        roles: roles,
        leadership_roles: leadershipRoles,
        time: time ? new Date(time).toISOString() : null,
        created_by: "917788439619993611", // Super admin ID or logged-in user's ID
      },
    ]);

    if (error) {
      console.error("Error posting quest:", error);
      alert("Error posting quest.");
    } else {
      alert("Quest posted successfully!");
      router.push("/quests"); // Redirect to quest board
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Create or Post Your Quest Here</h1>
      <div>
        <label htmlFor="objective" className="block text-yellow-300">
          Objective:
        </label>
        <input
          type="text"
          id="objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />

        <label htmlFor="description" className="block text-yellow-300">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />

        <label htmlFor="roles" className="block text-yellow-300">
          Roles (comma-separated, e.g. PowerDPS, AlacrityHeal):
        </label>
        <input
          type="text"
          id="roles"
          value={roles}
          onChange={(e) => setRoles(e.target.value.split(","))}
          className="w-full p-2 rounded mb-4"
        />

        <label htmlFor="leadershipRoles" className="block text-yellow-300">
          Leadership Roles (comma-separated, e.g. Commander, Lieutenant):
        </label>
        <input
          type="text"
          id="leadershipRoles"
          value={leadershipRoles}
          onChange={(e) => setLeadershipRoles(e.target.value.split(","))}
          className="w-full p-2 rounded mb-4"
        />

        <label htmlFor="time" className="block text-yellow-300">
          Time (optional):
        </label>
        <input
          type="datetime-local"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />

        <button
          onClick={handlePostQuest}
          className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400"
        >
          Post Quest
        </button>
      </div>
    </div>
  );
}
