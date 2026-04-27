import { Nav } from "@/components/Nav";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { WhereItHappens } from "./sections/WhereItHappens";
import { Electrical } from "./sections/Electrical";
import { Device } from "./sections/Device";
import { HowItWorks } from "./sections/HowItWorks";
import { Demo } from "./sections/Demo";
import { Value } from "./sections/Value";
import { CurrentState } from "./sections/CurrentState";
import { Team } from "./sections/Team";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        <Problem />
        <WhereItHappens />
        <Electrical />
        <Device />
        <HowItWorks />
        <Demo />
        <Value />
        <CurrentState />
        <Team />
      </main>
    </>
  );
}
