import Link from "next/link";
type Props={label:string;purpose:string;why:string;next:string;href:string;action:string};
export function PageGuidance({label,purpose,why,next,href,action}:Props){
 return <aside className="page-guidance" aria-label="Guidance for this page">
  <p className="page-guidance-kicker">{label} · A QUICK GUIDE</p>
  <div className="page-guidance-grid">
   <div><strong>What you are seeing</strong><p>{purpose}</p></div>
   <div><strong>Why it matters</strong><p>{why}</p></div>
   <div><strong>What to do next</strong><p>{next}</p></div>
  </div>
  <Link className="page-guidance-action" href={href}>{action} →</Link>
 </aside>
}
