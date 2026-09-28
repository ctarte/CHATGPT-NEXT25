import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  return (
    <main className="dash">
      <aside>
        <b>NEXT25™</b>
        <span>Overview</span>
        <span>My Discovery</span>
        <span>My Blueprint</span>
        <span>Opportunity Briefs</span>
        <span>90-Day Experiments</span>
        <span>Account & Privacy</span>
        <form action="/auth/sign-out" method="post" className="signout-form">
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <section>
        <p className="eyebrow">MY NEXT25</p>
        <h1>Your next chapter is taking shape.</h1>
        <p className="customer-session">Secure customer session active.</p>
        <div className="tiles">
          <article><small>DISCOVERY</small><b>Secure save & resume</b></article>
          <article><small>BLUEPRINT</small><b>Private PDF download</b></article>
          <article><small>OPPORTUNITY BRIEFS</small><b>Deep implementation research</b></article>
        </div>
        <div className="feature">
          <h2>Blueprint delivery</h2>
          <p>After human review, the final Blueprint PDF is stored privately and made available only to the authorized customer.</p>
        </div>
      </section>
    </main>
  );
}
