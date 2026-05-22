import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
 ArrowLeft, 
 FileText, 
 BookOpen, 
 Shield, 
 Briefcase, 
 Users, 
 Settings, 
 HelpCircle,
 Clock,
 Menu,
 ChevronRight,
 List
} from "lucide-react";
import { marked } from "marked";

const SLUG_TO_FILE: Record<string, string> = {
 "overview": "JANUS_OVERVIEW.md",
 "user-guide": "USER_GUIDE.md",
 "technical-whitepaper": "TECHNICAL_WHITEPAPER.md",
 "investor-pitch-deck": "INVESTOR_PITCH_DECK.md",
 "governance-documentation": "GOVERNANCE_DOCUMENTATION.md",
 "operational-manual": "OPERATIONAL_MANUAL.md",
 "faq-and-troubleshooting": "FAQ_AND_TROUBLESHOOTING.md"
};

const DOC_METADATA: Record<string, { title: string; category: string; readTime: string; icon: React.ReactNode }> = {
 "overview": {
 title: "Protocol Overview",
 category: "Introduction",
 readTime: "5 min read",
 icon: <FileText className="w-4 h-4" />
 },
 "user-guide": {
 title: "User Guide",
 category: "Basics",
 readTime: "7 min read",
 icon: <BookOpen className="w-4 h-4" />
 },
 "technical-whitepaper": {
 title: "Technical Whitepaper",
 category: "Architecture",
 readTime: "12 min read",
 icon: <Shield className="w-4 h-4" />
 },
 "investor-pitch-deck": {
 title: "Investor Pitch Deck",
 category: "Business",
 readTime: "8 min read",
 icon: <Briefcase className="w-4 h-4" />
 },
 "governance-documentation": {
 title: "Governance Docs",
 category: "DAO",
 readTime: "10 min read",
 icon: <Users className="w-4 h-4" />
 },
 "operational-manual": {
 title: "Operational Manual",
 category: "Operations",
 readTime: "9 min read",
 icon: <Settings className="w-4 h-4" />
 },
 "faq-and-troubleshooting": {
 title: "FAQ & Support",
 category: "Support",
 readTime: "6 min read",
 icon: <HelpCircle className="w-4 h-4" />
 }
};

interface PageProps {
 params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
 return Object.keys(SLUG_TO_FILE).map((slug) => ({
 slug,
 }));
}

export default async function DocPage({ params }: PageProps) {
 const { slug } = await params;
 
 const fileName = SLUG_TO_FILE[slug];
 if (!fileName) {
 notFound();
 }

 // Load the file content
 const docsDirectory = path.join(process.cwd(), "docs");
 const filePath = path.join(docsDirectory, fileName);

 let rawContent = "";
 try {
 rawContent = fs.readFileSync(filePath, "utf8");
 } catch (error) {
 console.error(`Error reading doc file: ${filePath}`, error);
 notFound();
 }

 // Generate Table of Contents from h2 elements dynamically
 const toc: { title: string; id: string }[] = [];
 const headerRegex = /^##\s+(.+)$/gm;
 let match;
 while ((match = headerRegex.exec(rawContent)) !== null) {
 const title = match[1].replace(/[]/g, "").trim();
 const id = title
 .toLowerCase()
 .replace(/[^\w\s-]/g, "")
 .trim()
 .replace(/\s+/g, "-");
 toc.push({ title, id });
 }

 // Custom marked renderer to inject IDs into Headings
 const renderer = new marked.Renderer();
 
 // Custom heading renderer
 renderer.heading = function({ tokens, depth }) {
 const text = this.parser.parseInline(tokens);
 const raw = tokens.map(t => t.raw).join("");
 const cleanText = raw.replace(/[]/g, "").trim();
 const id = cleanText
 .toLowerCase()
 .replace(/[^\w\s-]/g, "")
 .trim()
 .replace(/\s+/g, "-");
 
 return `<h${depth} id="${id}" class="scroll-mt-24 group relative">${text}<a href="#${id}" class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-indigo-500 font-normal">#</a></h${depth}>`;
 };

 // Custom table renderer to make tables super pretty and responsive
 renderer.table = function({ header, rows }) {
 let headerHtml = "";
 let bodyHtml = "";

 header.forEach(cell => {
 headerHtml += `<th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">${this.parser.parseInline(cell.tokens)}</th>`;
 });

 rows.forEach(row => {
 let rowHtml = "";
 row.forEach(cell => {
 rowHtml += `<td class="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900">${this.parser.parseInline(cell.tokens)}</td>`;
 });
 bodyHtml += `<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">${rowHtml}</tr>`;
 });

 return `<div class="overflow-x-auto my-8 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm"><table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800"><thead class="bg-slate-50 dark:bg-slate-900/30"><tr>${headerHtml}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-900 bg-transparent">${bodyHtml}</tbody></table></div>`;
 };

 // Convert Markdown to HTML
 const parsedContent = await marked(rawContent, { renderer });

 const activeDoc = DOC_METADATA[slug];

 return (
 <div className="relative bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 transition-colors min-h-screen">
 {/* Background Gradients */}
 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/3 rounded-full blur-[100px] pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-500/2 rounded-full blur-[100px] pointer-events-none" />

 {/* Hero Banner Area */}
 <div className="border-b border-slate-200 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md">
 <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-2">
 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
 <Link href="/docs" className="hover:underline flex items-center gap-1">
 <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
 </Link>
 <ChevronRight className="w-3 h-3 text-slate-400" />
 <span>{activeDoc.category}</span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
 {activeDoc.title}
 </h1>
 </div>
 <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 py-2 px-4 rounded-xl self-start md:self-auto">
 <span className="flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-indigo-500" /> {activeDoc.readTime}
 </span>
 <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
 <span>Updated May 2026</span>
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-6 py-12">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* LEFT SIDEBAR: Document list navigation */}
 <aside className="lg:col-span-3 space-y-6 sticky top-24">
 <div className="p-5 rounded-3xl bg-white dark:bg-[#0b0e1e] border border-slate-200 dark:border-slate-800/60">
 <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
 <List className="w-4 h-4 text-indigo-500" /> Janus Library
 </h3>
 <nav className="flex flex-col gap-1">
 {Object.entries(DOC_METADATA).map(([docSlug, docInfo]) => {
 const isActive = docSlug === slug;
 return (
 <Link
 key={docSlug}
 href={`/docs/${docSlug}`}
 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
 isActive
 ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
 : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
 }`}
 >
 <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500"}`}>
 {docInfo.icon}
 </div>
 <span className="truncate">{docInfo.title}</span>
 </Link>
 );
 })}
 </nav>
 </div>

 <div className="p-5 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 space-y-3">
 <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">Need support?</h4>
 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
 Can't find what you are looking for? Reach out directly via Discord or email.
 </p>
 <a 
 href="https://discord.gg/janus" 
 target="_blank" 
 rel="noreferrer" 
 className="inline-flex items-center justify-center w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
 >
 Join Discord
 </a>
 </div>
 </aside>

 {/* MIDDLE AREA: Document Reader Sheet */}
 <main className="lg:col-span-6 p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0b0e1e] border border-slate-200 dark:border-slate-800/60 shadow-xl shadow-slate-100 dark:shadow-none">
 <article 
 className="markdown-content prose max-w-none dark:prose-invert"
 dangerouslySetInnerHTML={{ __html: parsedContent }}
 />
 </main>

 {/* RIGHT SIDEBAR: Table of Contents */}
 <aside className="lg:col-span-3 space-y-6 sticky top-24 hidden lg:block">
 {toc.length > 0 && (
 <div className="p-5 rounded-3xl bg-white dark:bg-[#0b0e1e] border border-slate-200 dark:border-slate-800/60">
 <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">
 On this page
 </h3>
 <nav className="flex flex-col gap-2.5">
 {toc.map((item) => (
 <a
 key={item.id}
 href={`#${item.id}`}
 className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-start gap-1.5 leading-relaxed group"
 >
 <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors shrink-0" />
 <span>{item.title}</span>
 </a>
 ))}
 </nav>
 </div>
 )}

 <div className="p-5 rounded-3xl bg-white dark:bg-[#0b0e1e] border border-slate-200 dark:border-slate-800/60 text-center space-y-4">
 <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Vault Status</h4>
 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 text-left">
 <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Target Yield</div>
 <div className="text-xl font-heading font-black text-indigo-600 dark:text-indigo-400">24.5% APY</div>
 </div>
 <Link
 href="/app"
 className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-md"
 >
 Launch Vault
 </Link>
 </div>
 </aside>

 </div>
 </div>
 </div>
 );
}
