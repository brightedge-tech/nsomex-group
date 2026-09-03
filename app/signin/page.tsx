"use client";

import { Container } from "@/components/ui/container";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    function submit(e: React.FormEvent) {
      e.preventDefault();
      localStorage.setItem("nsomex_user", JSON.stringify({ email }));
      alert("Signed in (demo)");
    }
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <form onSubmit={submit} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-white">Sign In</button>
          </div>
        </form>
      </Container>
    </div>
  );
}
