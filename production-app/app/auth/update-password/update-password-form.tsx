
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Form() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function checkRecovery() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          if (active) setMessage("This recovery link is invalid or expired.");
          return;
        }

        window.history.replaceState({}, "", window.location.pathname);
      }

      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error || !data.session) {
        setMessage("No recovery session was found. Please request a new password-reset email.");
        return;
      }

      setReady(true);
      setMessage("");
    }

    checkRecovery();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 10) {
      setMessage("Use at least 10 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("The two passwords do not match.");
      return;
    }

    setBusy(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("Password update failed. Please request a new recovery link.");
      setBusy(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/auth/sign-in?reset=success");
    router.refresh();
  }

  return (
    <form className="signin-form" onSubmit={submit}>
      <label>
        New password
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={!ready || busy}
        />
      </label>

      <label>
        Confirm new password
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          disabled={!ready || busy}
        />
      </label>

      {message && <p className="auth-message" role="alert">{message}</p>}

      <button type="submit" disabled={!ready || busy}>
        {busy ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}
