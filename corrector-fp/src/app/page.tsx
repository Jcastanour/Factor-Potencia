import { Nav } from "@presentation/components/Nav";
import { Hero } from "@presentation/sections/Hero";
import { Problem } from "@presentation/sections/Problem";
import { WhereItHappens } from "@presentation/sections/WhereItHappens";
import { Electrical } from "@presentation/sections/Electrical";
import { Device } from "@presentation/sections/Device";
import { HowItWorks } from "@presentation/sections/HowItWorks";
import { Demo } from "@presentation/sections/Demo";
import { Value } from "@presentation/sections/Value";
import { CurrentState } from "@presentation/sections/CurrentState";
import { Team } from "@presentation/sections/Team";
import { RevealBoot } from "@infrastructure/motion/RevealBoot";

export default function Home() {
  return (
    <>
      <RevealBoot />
      <Nav />
      <main className="relative">
        <Hero />
        <Problem />
        <WhereItHappens />
        <Electrical />
        <Device />
        <Demo />
        <HowItWorks />
        <Value />
        <CurrentState />
        <Team />
      </main>
    </>
  );
}
