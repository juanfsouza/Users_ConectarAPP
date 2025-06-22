"use client";

import { TypewriterEffectSmooth } from "../../components/ui/typewriter-effect";

export default function SettingsPage() {
  const words = [
    {
      text: "Build",
    },
    {
      text: "challenge",
    },
    {
      text: "apps",
    },
    {
      text: "with",
    },
    {
      text: "User Manager",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        Creative Makes Agents
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
      </div>
    </div>
  );
}

