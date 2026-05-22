import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight,
  FileText, 
  BookOpen, 
  Shield, 
  Users, 
  Settings, 
  HelpCircle,
  Clock,
  ChevronRight,
  List
} from "lucide-react";
import { marked } from "marked";

const SLUG_TO_FILE: Record<string, string> = {
  "overview": "JANUS_OVERVIEW.md",
  "user-guide": "USER_GUIDE.md",
  "technical-whitepaper": "TECHNICAL_WHITEPAPER.md",
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

  const docsDirectory = path.join(process.cwd(), "docs");
  const filePath = path.join(docsDirectory, fileName);

  let rawContent = "";
  try {
    rawContent = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading doc file: ${filePath}`, error);
    notFound();
  }

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

  const renderer = new marked.Renderer();
  
  renderer.heading = function({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const raw = tokens.map(t => t.raw).join("");
    const cleanText = raw.replace(/[]/g, "").trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    
    return `<h${depth} id="${id}" class="scroll-mt-24 font-heading group relative">${text}<a href="#${id}" class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-slate-400 font-normal">#</a></h${depth}>`;
  };

  renderer.table = function({ header, rows }) {
    let headerHtml = "";
    let bodyHtml = "";

    header.forEach(cell => {
      headerHtml += `<th class="px-0 py-3 text-left text-xs font-medium uppercase tracking-widest text-slate-500 border-b border-borderLine">${this.parser.parseInline(cell.tokens)}</th>`;
    });

    rows.forEach(row => {
      let rowHtml = "";
      row.forEach(cell => {
        rowHtml += `<td class="px-0 py-3 text-sm text-foreground border-b border-borderLine/50">${this.parser.parseInline(cell.tokens)}</td>`;
      });
      bodyHtml += `<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">${rowHtml}</tr>`;
    });

    return `<div class="overflow-x-auto my-8"><table class="min-w-full divide-y divide-borderLine"><thead><tr>${headerHtml}</tr></thead><tbody class="divide-y divide-borderLine/50 bg-transparent">${bodyHtml}</tbody></table></div>`;
  };

  const parsedContent = await marked(rawContent, { renderer });
  const activeDoc = DOC_METADATA[slug];

  return (
    <div className="relative min-h-screen bg-background transition-colors py-32 overflow-hidden flex justify-center">
      
      {/* Background Mesh */}
      <div className="absolute top-[20%] left-[10%] w-[35%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        
        {/* Navigation & Header */}
        <div className="mb-12">
          <Link 
            href="/docs" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-borderLine text-sm font-medium text-slate-500 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-sm text-slate-500 mb-3 font-medium">
                <span className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 border border-borderLine">{activeDoc.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {activeDoc.readTime}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                {activeDoc.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area */}
          <main className="lg:col-span-8 bg-panel border border-borderLine rounded-[32px] p-6 md:p-10 lg:p-12 shadow-premium dark:shadow-premium-dark backdrop-blur-xl">
            <article 
              className="markdown-content max-w-none"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24 hidden lg:block bg-panel border border-borderLine rounded-[32px] p-6 md:p-8 shadow-sm backdrop-blur-xl">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  On this page
                </h3>
                <nav className="flex flex-col gap-3">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm font-medium text-slate-500 hover:text-accent transition-colors leading-relaxed"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Other Documents */}
            <div className={toc.length > 0 ? "pt-8 border-t border-borderLine" : ""}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <List className="w-3.5 h-3.5" /> Library
              </h3>
              <nav className="flex flex-col gap-1">
                {Object.entries(DOC_METADATA).map(([docSlug, docInfo]) => {
                  const isActive = docSlug === slug;
                  return (
                    <Link
                      key={docSlug}
                      href={`/docs/${docSlug}`}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-accent/10 text-accent font-bold border border-accent/20"
                          : "text-slate-500 font-medium hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {docInfo.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* Support */}
            <div className="pt-8 border-t border-borderLine">
               <p className="text-sm font-medium text-slate-500 mb-4">
                 Can't find what you are looking for?
               </p>
               <a 
                 href="https://discord.gg/janus" 
                 target="_blank" 
                 rel="noreferrer" 
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-borderLine text-sm font-semibold text-foreground hover:text-accent transition-all hover:border-accent/30"
               >
                 Join Discord <ArrowRight className="w-4 h-4" />
               </a>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
