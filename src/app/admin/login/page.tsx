"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Password salah");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="max-w-md w-full bg-[#151515] border border-[#2a2a2a] p-8 rounded-none shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f7] font-mono">
            // ADMIN PORTAL
          </h1>
          <p className="text-sm text-[#a1a1aa] mt-2">
            Masukkan password administrator untuk akses manajemen konten.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono" role="alert">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee]"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22d3ee] text-[#0f0f0f] font-mono font-bold py-2 px-4 hover:bg-[#06b6d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#22d3ee] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0f0f0f]"
          >
            {loading ? "Authenticating..." : "Login to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
