import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignInForm from "./sign-in-form";
import ForgotPasswordForm from "./forgot-password-form";

export default async function SignIn() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="cardpage">
      <section className="signin-card">
        <p className="eyebrow">CUSTOMER ACCESS</p>
        <h1>Welcome back to Discovered by Design™.</h1>
        <p className="lead">
          Sign in to continue your private discovery and Blueprint experience.
        </p>
        <SignInForm />
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
