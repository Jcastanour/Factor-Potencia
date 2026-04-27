"use client";

import { useEffect, useRef } from "react";
import { cn } from "@shared/utils/cn";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export function Reveal({ delay = 0, className, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add("in"), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} data-reveal className={cn(className)} {...rest}>
      {children}
    </div>
  );
}
