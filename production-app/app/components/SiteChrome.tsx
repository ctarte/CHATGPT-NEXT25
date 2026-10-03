import Link from "next/link";

export function Header(){
  return <header className="site-header"><Link className="brand" href="/"><span>DISCOVERED</span><small>BY DESIGN™</small></Link><nav aria-label="Primary navigation"><Link href="/how-it-works">How It Works</Link><Link href="/explore">Explore Possibilities</Link><Link href="/blueprint">Your Blueprint</Link><Link href="/pricing">Pricing</Link><Link href="/about">About</Link><Link className="nav-cta" href="/start">Start Discovering</Link></nav></header>
}
export function Footer(){
  return <footer className="site-footer"><div><strong>DISCOVERED BY DESIGN™</strong><p>Career · Business · Ideas · Experiences · What’s Next</p></div><p className="footer-note">Discovery expands the field. You decide what deserves a closer look.</p></footer>
}
export function Chrome({children}:{children:React.ReactNode}){return <><Header/>{children}<Footer/></>}
