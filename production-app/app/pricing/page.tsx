import Link from "next/link";
import {Chrome} from "../components/SiteChrome";

export default function Page(){
 return <Chrome><main>
  <section className="page-hero blueprint-hero">
   <p className="eyebrow">CHOOSE HOW FAR YOU WANT TO GO</p>
   <h1>Start with Discovery.<br/><em>Go deeper when you find a direction worth exploring.</em></h1>
   <p className="lead">Both versions begin with the same personalized Think Tank process. The difference is simple: one helps you discover directions worth considering; the other goes further and investigates whether the strongest directions hold up in the real world.</p>
  </section>
  <section className="section">
   <div className="steps pricing-grid">
    <article>
     <p className="eyebrow dark">DISCOVERY</p>
     <h2>$595</h2>
     <h3>Discover what else you could become.</h3>
     <p>A complete Discovery experience for people who want outside eyes, fresh thinking and personalized directions they may not have found on their own.</p>
     <p><b>INCLUDES</b></p>
     <p>Full Discovery process · Think Tank Reveals · personalized opportunity directions · reaction and refinement rounds · why each direction surfaced · Personalized Discovery Blueprint</p>
     <Link className="button dark-button" href="/start">Start with Discovery →</Link>
    </article>
    <article>
     <p className="eyebrow dark">DISCOVERY + OPPORTUNITY INTELLIGENCE</p>
     <h2>$995</h2>
     <h3>Discover what could come next—and where the world may be creating or closing opportunities for someone like you.</h3>
     <p>Everything in Discovery, plus an outward-looking research layer that studies where the world is going—and connects those changes back to the directions that earned your attention.</p>
     <p><b>ADDS</b></p>
     <p>Emerging fields · declining fields · AI & technology disruption · demographic change · new business models · skills in rising demand · geographic shifts · market, career or business evidence · counter-evidence · low-risk experiment design · Opportunity Decision Brief · 90-day intelligence plan</p>
     <Link className="button gold" href="/start">Start Discovery + Opportunity Intelligence →</Link>
    </article>
   </div>
  </section>
  <section className="section blueprint-summary">
   <div>
    <p className="eyebrow dark">START SMALLER IF YOU PREFER</p>
    <h2>You do not have to decide how far to go before you know what we discover.</h2>
    <p>Begin with Discovery for $595. If one or more directions earn a closer look, you can add Opportunity Intelligence later for the $400 difference. Your Discovery carries forward—you do not start over.</p>
    <blockquote>Discover the person. Study the world around the opportunity. Make larger commitments only when the evidence justifies them.</blockquote>
   </div>
   <div className="sample-page">
    <span>ONE PROCESS · TWO DEPTHS</span>
    <h3>What question are you trying to answer?</h3>
    <hr/>
    <b>DISCOVERY · $595</b>
    <p>“What else could I become?”</p>
    <b>DISCOVERY + OPPORTUNITY INTELLIGENCE · $995</b>
    <p>“Where is the world creating—or closing—opportunities for someone like me?”</p>
    <b>UPGRADE LATER</b>
    <p>Add Opportunity Intelligence for $400 without repeating Discovery.</p>
   </div>
  </section>
  <section className="section blueprint-close">
   <p className="eyebrow dark">DISCOVERED BY DESIGN™</p>
   <h2>Not more choices. A clearer next question.</h2>
   <p>If you are unsure, start with Discovery. The point is to learn enough about you—and what catches your attention—before asking you to make a larger commitment.</p>
   <Link className="button dark-button" href="/start">Begin my Discovery →</Link>
  </section>
 </main></Chrome>
}