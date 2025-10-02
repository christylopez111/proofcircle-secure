"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function BackofficePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const getUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email);

        // fetch role from profiles
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setRole(data.role);
        }
      }
    };

    getUserAndRole();
  }, []);

  if (!userEmail) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">📊 ProofCircle Back Office</h1>
      <p className="mb-6">Welcome, {userEmail}! You are logged in securely.</p>

      {role === "superadmin" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Super Admin Panel</h2>
          <ul className="list-disc ml-6">
            <li>Manage Employees</li>
            <li>Manage Users</li>
            <li>View Reports</li>
            <li>NDAs & Agreements</li>
          </ul>
        </div>
      )}

      {role === "employee" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Employee Panel</h2>
          <ul className="list-disc ml-6">
            <li>Verify Users</li>
            <li>Check Verification Points</li>
          </ul>
        </div>
      )}

      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          window.location.href = "/admin";
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}