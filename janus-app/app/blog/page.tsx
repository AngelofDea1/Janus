"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function BlogIndexPage() {
  const posts = [
    {
      title: "How to Partake in Janus Testnet",
      excerpt: "A complete step-by-step visual guide on how to claim testnet tokens, deposit into Janus vaults, and start earning delta-neutral yield.",
      slug: "how-to-partake-in-janus-testnet",
      date: "June 2026",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex justify-center">
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-foreground transition-colors mb-12 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tighter mb-4 text-foreground">
            Blog & Updates
          </h1>
          <p className="text-slate-500 text-lg">
            Read the latest news, tutorials, and deep dives from the Janus Protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="bg-panel border border-borderLine rounded-[24px] p-8 shadow-sm hover:shadow-premium dark:hover:shadow-premium-dark backdrop-blur-xl transition-all cursor-pointer group">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
