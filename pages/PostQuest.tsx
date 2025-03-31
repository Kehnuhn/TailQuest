import { supabase } from "../lib/supabase";
import { useState } from "react";

const rolesList = [
  "PowerDPS", "CondiDPS", "AlacrityDPS", "QuicknessDPS",
  "AlacrityHeal", "QuicknessHeal", "AlacrityTank", "QuicknessTank",
  "Kiter", "Special Role(s)", "Other"
];

const leadershipRoles = ["Commander", "Lieutenant", "Mentor"];

export default function PostQuest() {
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [time, setTime] = useState("");

  const toggleRole = (role: string, list: string[], setList: Function) => {
    if (list.includes(role)) {
      setList(list.filter(r => r !== role));
    } else {
      setList([...list, role]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center">Create a Quest</h1>

      <label className="block mb-2">Objective</label>
      <input
        type="text"
        value={objective}
        onChange={e => setObjective(e.target.value)}
        className="w-full px-4 py-2 mb-4 bg-gray-900 text-yellow-300 rounded-xl"
      />

      <label className="block mb-2">Description</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-4 py-2 mb-4 h-32 bg-gray-900 text-yellow-300 rounded-xl"
      />

      <label className="block mb-2">Select Roles</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {rolesList.map(role => (
          <button
            key={role}
            onClick={() => toggleRole(role, selectedRoles, setSelectedRoles)}
            className={`px-4 py-2 rounded-xl border ${selectedRoles.includes(role) ? "bg-yellow-500 text-black" : "bg-gray-800 text-yellow-300"}`}
          >
            {role}
          </button>
        ))}
      </div>

      <label className="block mb-2">Leadership Roles</label>
      <div className="flex gap-2 mb-4">
        {leadershipRoles.map(role => (
          <button
            key={role}
            onClick={() => toggleRole(role, selectedLeads, setSelectedLeads)}
            className={`px-4 py-2 rounded-xl border ${selectedLeads.includes(role) ? "bg-yellow-500 text-black" : "bg-gray-800 text-yellow-300"}`}
          >
            {role}
          </button>
        ))}
      </div>

      <label className="block mb-2">Time (Optional)</label>
      <input
        type="datetime-local"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="w-full px-4 py-2 mb-6 bg-gray-900 text-yellow-300 rounded-xl"
      />

      <button
        className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300"
        onClick={async () => {
  const { data, error } = await supabase.from("quests").insert([
    {
      objective,
      description,
      roles: selectedRoles,
      leadership_roles: selectedLeads,
      time: time ? new Date(time).toISOString() : null,
    },
  ]);

  if (error) {
    console.error("Failed to post quest:", error);
    alert("Error posting quest");
  } else {
    alert("Quest posted successfully!");
    // Optionally reset form:
    setObjective("");
    setDescription("");
    setSelectedRoles([]);
    setSelectedLeads([]);
    setTime("");
  }
}}
      >
        Post Quest
      </button>
    </div>
  );
}
