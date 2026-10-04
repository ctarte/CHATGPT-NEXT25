"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage("We couldn't sign you in. Check your email and password and try again.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setMessage("Customer access is temporarily unavailable. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="signin-form" onSubmit={submit}>
      <label>
        Email address
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {message ? <p className="auth-message" role="alert">{message}</p> : null}
      <button type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in securely"}
      </button>
      <p className="auth-note">
        Discovered by Design™ customer access is private. Never share your password with anyone.
      </p>
    </form>
  );
}
