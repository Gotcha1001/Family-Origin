"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Search, ScrollText, Clock, Globe2 } from "lucide-react";

const FEATURES = [
  {
    title: "Instant surname lookup",
    description:
      "Type a surname, get its origin, meaning, and history synthesized from public sources in seconds.",
    icon: Search,
  },
  {
    title: "Notable bearers",
    description: "See historically notable people who shared your surname.",
    icon: ScrollText,
  },
  {
    title: "Where it's from",
    description:
      "Understand the regions and countries where the name is historically and currently common.",
    icon: Globe2,
  },
  {
    title: "Search history",
    description:
      "Revisit every report you've generated, saved to your account.",
    icon: Clock,
  },
];

const SAMPLE_SURNAMES = ["Kavanagh", "Nakamura", "Okafor", "Petrov", "Reyes"];

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.prefetch("/dashboard");
  }, [isSignedIn, router]);

  return (
    <main className="relative min-h-screen flex flex-col items-center px-6 text-center overflow-hidden bg-white dark:bg-gray-950">
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] rounded-full bg-amber-950/40"
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -60, 0] }}
          transition={{ duration: 28, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute bottom-[-300px] right-[-300px] w-[800px] h-[800px] rounded-full bg-emerald-950/30"
          animate={{ scale: [1, 1.25, 1], x: [0, -100, 0], y: [0, 90, 0] }}
          transition={{ duration: 32, repeat: Infinity, repeatType: "mirror" }}
        />
      </div>

      <div className="pt-24" />

      <motion.h1
        className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tight relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Family <span className="text-amber-600 dark:text-amber-400">Roots</span>
      </motion.h1>

      <motion.p
        className="mt-5 text-gray-600 dark:text-gray-300 text-lg max-w-xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Type a surname. Get its origin, meaning, and history — pulled from the
        web and written up for you in seconds.
      </motion.p>

      <motion.div
        className="mt-6 flex flex-wrap gap-2 justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        {SAMPLE_SURNAMES.map((name) => (
          <span
            key={name}
            className="rounded-full border border-amber-200 dark:border-amber-900/40 px-3 py-1 text-xs text-gray-500 dark:text-gray-400"
          >
            {name}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap gap-4 justify-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7 }}
      >
        {isSignedIn ? (
          <Button
            size="lg"
            className="text-lg px-10 py-6 bg-amber-600 hover:bg-amber-500 text-white shadow-lg"
            onClick={() => router.push("/dashboard")}
          >
            Go to your dashboard →
          </Button>
        ) : (
          <>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-amber-600 hover:bg-amber-500 text-white shadow-lg"
              >
                Sign in to start searching
              </Button>
            </SignInButton>
            <Link href="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-6 border-amber-500 text-amber-700 dark:text-amber-400"
              >
                Create account
              </Button>
            </Link>
          </>
        )}
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-5xl w-full relative z-10 pb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-white/70 dark:bg-gray-900/50 shadow-lg backdrop-blur-sm text-left"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <feature.icon className="h-6 w-6 mb-3 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
