import Link from "next/link";import {Chrome} from "../components/SiteChrome";
const worlds=[
["CAREER","What else could I do?","Explore new careers, fractional roles, project work, teaching, specialist work and unexpected ways to use what you know.","Fractional Executive · Specialty Researcher · Instructor · Industry Analyst · Expert Adviser"],
["BUSINESS","What could I build?","Explore business models designed around what you enjoy—and what you never want to deal with again.","Specialty Consulting · Expert Education · Licensing · Niche Research · Microbusiness"],
["WHAT YOU KNOW","Could what I know become something valuable?","Explore experience, expertise, ideas, methods and know-how that could become something useful.","Write It · Teach It · Package It · Advise With It · Productize It"],
["EXPERIENCES & PURSUITS","What else would I like to learn, create or experience?","Explore creative, intellectual, educational, travel, teaching, service and other pursuits.","Learn · Travel · Teach · Create · Research · Mentor · Explore · Serve"],
["SURPRISE ME","Show me something I wouldn’t have thought to search for.","Step outside the obvious. Let discovery take you somewhere you may never have thought to look.",""]
];
export default function Page(){return <Chrome><main><section className="page-hero"><p className="eyebrow">EXPLORE POSSIBILITIES</p><h1>You don’t know what you don’t know.</h1><p className="lead">Your next direction may be something you’ve already considered—or something just beyond the edge of what you’ve encountered. The point isn’t to find the answer immediately. It’s to expand what you know is possible.</p></section>
<section className="section world-grid">{worlds.map((w,i)=><article className={i===4?"world-card surprise":"world-card"} key={w[0]}><span>0{i+1}</span><h2>{w[0]}</h2><h3>{w[1]}</h3><p>{w[2]}</p>{w[3]&&<small>{w[3]}</small>}</article>)}</section>
<section className="cta-band"><h2>Not sure where to begin?</h2><p>That’s a perfectly good place to start.</p><Link className="button gold" href="/start">Help me find what’s next →</Link></section></main></Chrome>}
