"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { ResearchOrb } from "./ResearchOrb";
import {
  ideas,
  instruments,
  clients,
  type Idea,
  type Stage,
  type Client,
} from "@/lib/data";
import {
  bindTerms,
  createDraftExport,
  isReviewCurrent,
  scenarioCashflows,
  validateTerms,
} from "@/lib/contracts.mjs";

type View =
  | "Workspace"
  | "Pipeline"
  | "Builder"
  | "Clients"
  | "Analytics"
  | "Design system";
const navigation: {
  view: View;
  label: string;
  icon: string;
  count?: string;
}[] = [
  { view: "Workspace", label: "Workspace", icon: "desk" },
  {
    view: "Pipeline",
    label: "Opportunity pipeline",
    icon: "pipeline",
    count: String(ideas.length),
  },
  { view: "Builder", label: "Idea builder", icon: "layers" },
  { view: "Clients", label: "Client evidence", icon: "clients" },
  { view: "Analytics", label: "Analytics", icon: "chart" },
];
const stages: Stage[] = ["Research", "Draft", "Review", "Evidence"];
function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`tag ${tone}`}>{children}</span>;
}
function StageTag({ stage }: { stage: Stage }) {
  return (
    <span className={`stage-label stage-${stage.toLowerCase()}`}>
      <span className="stage-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {stage}
    </span>
  );
}
function SectionHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
function Button({
  children,
  onClick,
  primary = false,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`${primary ? "button primary" : "button"} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="note">
      <Icon name="info" size={16} />
      <p>{children}</p>
    </div>
  );
}
function MiniChart({ variant = 0 }: { variant?: number }) {
  const lines = [
    "0,58 15,51 28,54 42,35 54,42 69,29 80,34 94,16 108,24 122,11 138,16 155,7",
    "0,45 18,41 32,51 48,32 62,36 78,20 94,28 109,17 122,24 140,12 155,18",
    "0,55 15,40 30,43 45,31 60,40 75,24 90,30 108,17 125,20 140,10 155,13",
  ];
  return (
    <svg
      className="mini-chart"
      viewBox="0 0 155 68"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 65H155" stroke="currentColor" opacity=".18" />
      <polyline
        points={lines[variant % 3]}
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function Basket({ ids }: { ids: string[] }) {
  return (
    <div className="basket">
      {ids.map((id) => (
        <span key={id} title={instruments.find((i) => i.id === id)?.name}>
          {id.replace("MOCK-", "")}
        </span>
      ))}
    </div>
  );
}
function IdeaCard({
  idea,
  onOpen,
  showStage = true,
}: {
  idea: Idea;
  onOpen: (i: Idea) => void;
  showStage?: boolean;
}) {
  return (
    <button className="idea-card" onClick={() => onOpen(idea)}>
      <div className="card-top">
        <span className="mono">{idea.id}</span>
        {showStage && <StageTag stage={idea.stage} />}
      </div>
      <div className={`idea-visual ${idea.color}`}>
        <span className="visual-cross">+</span>
        <MiniChart variant={ideas.indexOf(idea)} />
      </div>
      <h3>{idea.title}</h3>
      <p>{idea.subtitle}</p>
      <div className="card-footer">
        <span>
          {idea.currency} / {idea.tenor} months
        </span>
        <Icon name="up" size={18} />
      </div>
    </button>
  );
}

export function Workspace() {
  const [view, setView] = useState<View>("Workspace");
  const [theme, setTheme] = useState("day");
  const [unknown, setUnknown] = useState(false);
  const [origin, setOrigin] = useState<View>("Workspace");
  const [selected, setSelected] = useState<Idea | null>(null);
  const [builderIdea, setBuilderIdea] = useState<Idea>(ideas[0]);
  const [toast, setToast] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(false);
  const searchRef = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const navigate = (next: View) => {
    setUnknown(false);
    setView(next);
    setSelected(null);
    window.location.hash = next.toLowerCase().replaceAll(" ", "-");
    window.scrollTo(0, 0);
  };
  const openIdea = (idea: Idea) => {
    setOrigin(view);
    setSelected(idea);
    setUnknown(false);
    window.location.hash = `idea/${idea.id}`;
    window.scrollTo(0, 0);
  };
  const build = (idea: Idea) => {
    setBuilderIdea(idea);
    navigate("Builder");
  };
  useEffect(() => {
    const sync = () => {
      let hash = "";
      try {
        hash = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        setUnknown(true);
        return;
      }
      if (hash.startsWith("idea/")) {
        const idea = ideas.find((i) => i.id === hash.slice(5));
        setSelected(idea ?? null);
        setUnknown(!idea);
        return;
      }
      const known: View[] = [
        "Workspace",
        "Pipeline",
        "Builder",
        "Clients",
        "Analytics",
        "Design system",
      ];
      const found = known.find(
        (v) => v.toLowerCase().replaceAll(" ", "-") === hash,
      );
      setUnknown(Boolean(hash && !found));
      if (found || !hash) {
        setView(found ?? "Workspace");
        setSelected(null);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.showModal();
      searchInput.current?.focus();
    } else searchRef.current?.close();
  }, [searchOpen]);
  const save = (id: string) => {
    setSaved((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));
    setToast(
      saved.includes(id)
        ? "Idea removed from your local reading list."
        : "Idea saved to your local reading list.",
    );
  };
  return (
    <div className="app" data-theme={theme}>
      <aside className="sidebar">
        <a
          className="brand"
          href="#workspace"
          onClick={() => navigate("Workspace")}
          aria-label="Alphaville workspace"
        >
          <span className="brand-mark">
            a<span>v</span>
          </span>
          <span>
            alphaville<span className="brand-period">.</span>
          </span>
        </a>
        <div className="desk-selector">
          <span className="desk-avatar">A</span>
          <div>
            <strong>The research desk</strong>
            <span>Personal workspace</span>
          </div>
          <span className="selector-dots">···</span>
        </div>
        <div className="nav-label">YOUR WORKSPACE</div>
        <nav aria-label="Main navigation">
          {navigation.map((n) => (
            <button
              key={n.view}
              className={`nav-item ${view === n.view ? "active" : ""}`}
              onClick={() => navigate(n.view)}
              aria-current={view === n.view ? "page" : undefined}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.count && <small>{n.count}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-rule" />
        <div className="nav-label">
          RECENT IDEAS <span>{Math.min(3, ideas.length)}</span>
        </div>
        <div className="recent-list">
          {ideas.slice(0, 3).map((i, n) => (
            <button key={i.id} onClick={() => openIdea(i)}>
              <span className={`recent-dot dot-${n}`} />
              {i.title}
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="prototype-card">
            <span className="tiny-status" /> <strong>Local prototype</strong>
            <p>Fictional data. No connected services.</p>
            <button onClick={() => navigate("Design system")}>
              Explore the system <Icon name="arrow" size={15} />
            </button>
          </div>
          <button
            className={`nav-item ${view === "Design system" ? "active" : ""}`}
            onClick={() => navigate("Design system")}
          >
            <Icon name="palette" />
            <span>Design system</span>
          </button>
          <div className="profile">
            <div className="avatar">AD</div>
            <div>
              <strong>Alex Demo</strong>
              <span>Research & structuring</span>
            </div>
            <button
              className="icon-button"
              aria-label={`Switch to ${theme === "day" ? "night" : "day"} theme`}
              onClick={() => setTheme(theme === "day" ? "night" : "day")}
            >
              <Icon name={theme === "day" ? "moon" : "sun"} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            The research desk <Icon name="chevron" size={12} />
            <strong>
              {view === "Pipeline"
                ? "Opportunity pipeline"
                : view === "Clients"
                  ? "Client evidence"
                  : view === "Builder"
                    ? "Idea builder"
                    : view}
            </strong>
          </div>
          <div className="topbar-actions">
            <button
              className="command-search"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" size={17} />
              <span>Find an idea or tool</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Open desk updates"
              onClick={() => setNotifications(!notifications)}
            >
              <Icon name="bell" />
              <i />
            </button>
            <div className="avatar small">AD</div>
          </div>
          {notifications && (
            <div className="notification-panel">
              <div className="card-top">
                <h3>Desk updates</h3>
                <button
                  className="icon-button"
                  onClick={() => setNotifications(false)}
                  aria-label="Close updates"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
              <p>
                <strong>No services are connected</strong>
                <br />
                This prototype uses fictional example data.
              </p>
              <p>
                <strong>{saved.length} ideas in your reading list.</strong>
                <br />
                Selections last for this browser session only.
              </p>
            </div>
          )}
        </header>
        <main id="main" ref={mainRef} tabIndex={-1}>
          <div className="edition-strip">
            <span>
              <i />
              LOCAL PROTOTYPE
            </span>
            <span>THURSDAY, 12 NOVEMBER 2026</span>
            <span>SYNTHETIC DATA ONLY</span>
          </div>
          {unknown ? (
            <div className="empty-state">
              <Icon name="search" size={32} />
              <h1>Page not found</h1>
              <p>
                This address is unavailable. Your draft is still in the idea
                builder.
              </p>
              <Button primary onClick={() => navigate("Workspace")}>
                Return to workspace
              </Button>
            </div>
          ) : selected ? (
            <IdeaDetail
              idea={selected}
              onBack={() => navigate(origin)}
              onBuild={() => build(selected)}
              onSave={() => save(selected.id)}
              saved={saved.includes(selected.id)}
              onClients={() => navigate("Clients")}
            />
          ) : (
            <>
              {view === "Workspace" && (
                <Dashboard
                  onNavigate={navigate}
                  onOpen={openIdea}
                  onBuild={() => build(ideas[0])}
                  onToast={setToast}
                />
              )}
              {view === "Pipeline" && (
                <Pipeline onOpen={openIdea} onBuild={() => build(ideas[0])} />
              )}

              {view === "Clients" && <ClientEvidence />}
              {view === "Analytics" && <Analytics />}
              {view === "Design system" && (
                <DesignSystem
                  theme={theme}
                  onTheme={() => setTheme(theme === "day" ? "night" : "day")}
                  onToast={setToast}
                />
              )}
            </>
          )}
          <div hidden={view !== "Builder" || !!selected || unknown}>
            <Builder
              key={builderIdea.id}
              idea={builderIdea}
              onToast={setToast}
            />
          </div>
          <footer className="page-footer">
            <span>
              ALPHAVILLE <span className="footer-dot">/</span> RESEARCH DESK
            </span>
            <span>
              Design example. Not investment advice or an executable quote.
            </span>
          </footer>
        </main>
      </div>
      <div
        className="toast"
        role="status"
        aria-live="polite"
        data-visible={!!toast}
      >
        {toast && (
          <>
            <Icon name="check" size={18} />
            {toast}
          </>
        )}
      </div>
      <dialog
        ref={searchRef}
        className="search-dialog"
        onCancel={() => setSearchOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSearchOpen(false);
        }}
      >
        <div className="search-dialog-inner">
          <div className="search-input">
            <Icon name="search" />
            <input
              ref={searchInput}
              aria-label="Search ideas and tools"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ideas, tools, evidence…"
            />
            <button
              className="icon-button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="search-results">
            <p className="eyebrow">TOOLS & IDEAS</p>
            {navigation
              .filter((n) =>
                n.label.toLowerCase().includes(query.toLowerCase()),
              )
              .map((n) => (
                <button
                  key={n.view}
                  onClick={() => {
                    navigate(n.view);
                    setSearchOpen(false);
                  }}
                >
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                  <Icon name="arrow" size={16} />
                </button>
              ))}
            {ideas
              .filter((i) =>
                (i.title + " " + i.subtitle)
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((i) => (
                <button
                  key={i.id}
                  onClick={() => {
                    openIdea(i);
                    setSearchOpen(false);
                  }}
                >
                  <Icon name="book" />
                  <span>
                    {i.title}
                    <small>
                      {i.id} · {i.stage}
                    </small>
                  </span>
                  <Icon name="arrow" size={16} />
                </button>
              ))}
            {!navigation.some((n) =>
              n.label.toLowerCase().includes(query.toLowerCase()),
            ) &&
              !ideas.some((i) =>
                (i.title + " " + i.subtitle)
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              ) && (
                <p className="empty-state">
                  No results. Try “income”, “clients” or “builder”.
                </p>
              )}
          </div>
          <div className="search-foot">
            <span>Searches the examples in this prototype</span>
            <kbd>ESC to close</kbd>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function Dashboard({
  onNavigate,
  onOpen,
  onBuild,
  onToast,
}: {
  onNavigate: (v: View) => void;
  onOpen: (i: Idea) => void;
  onBuild: () => void;
  onToast: (s: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [research, setResearch] = useState(false);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>The research desk</h1>
        </div>
        <Button primary onClick={onBuild}>
          <Icon name="plus" size={18} />
          Build an idea
        </Button>
      </div>
      <div className="overview-stats">
        {[
          {
            label: "Ideas",
            value: ideas.length,
            note: "Across four stages",
            icon: "pipeline",
          },
          {
            label: "Awaiting review",
            value: ideas.filter((idea) => idea.stage === "Review").length,
            note: "Draft terms prepared",
            icon: "layers",
          },
          {
            label: "Recorded purchases",
            value: clients.reduce((total, client) => total + client.count, 0),
            note: "Across 5 fictional profiles",
            icon: "clients",
          },
          {
            label: "Research questions",
            value: ideas.filter((idea) => idea.stage === "Research").length,
            note: "Missing supporting sources",
            icon: "book",
          },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() =>
              onNavigate(s.icon === "clients" ? "Clients" : "Pipeline")
            }
          >
            <div>
              <span>{s.label}</span>
              <Icon name={s.icon} size={17} />
            </div>
            <strong>{s.value}</strong>
            <small>{s.note}</small>
          </button>
        ))}
      </div>
      <div className="front-grid">
        <section className="lead-story">
          <div className="section-heading">
            <h2>Featured idea</h2>
          </div>
          <div className="lead-inner">
            <div className="lead-copy">
              <h2>
                Defensive
                <br />
                <em>income</em>
              </h2>
              <p>
                Review the income case, the weakest underlying and the risk to
                your principal before choosing terms.
              </p>
              <div className="story-meta">
                <span>3 underlyings</span>
                <span>24 months</span>
              </div>
              <Button onClick={() => onOpen(ideas[0])}>
                Open the idea
                <Icon name="arrow" size={17} />
              </Button>
            </div>
            <div className="lead-figure">
              <ResearchOrb />
            </div>
          </div>
        </section>
        <aside className="desk-notes">
          <SectionHeading title="Research tasks" />
          <div className="radar-entry">
            <div>
              <span className="editorial-status amber">Missing evidence</span>
              <h3>Check infrastructure demand</h3>
              <p>Independent order data is missing from this idea.</p>
              <button className="text-link" onClick={() => onOpen(ideas[1])}>
                Check the risks <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
          <div className="radar-entry">
            <div>
              <h3>Compare past purchases</h3>
              <p>
                See which past purchases have similar terms and where records
                are missing.
              </p>
              <button
                className="text-link"
                onClick={() => onNavigate("Clients")}
              >
                Explore client evidence <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        </aside>
      </div>
      <section className="pipeline-preview">
        <SectionHeading title="Recent ideas">
          <button className="text-link" onClick={() => onNavigate("Pipeline")}>
            View pipeline <span className="count-chip">{ideas.length}</span>
            <Icon name="arrow" size={17} />
          </button>
        </SectionHeading>
        <div className="idea-grid">
          {ideas.slice(0, 3).map((i) => (
            <IdeaCard key={i.id} idea={i} onOpen={onOpen} />
          ))}
        </div>
      </section>
      <section className="research-desk">
        <div>
          <h2>Research a question</h2>
          <p>Use the example below to see how research is presented</p>
        </div>
        <div className="research-composer">
          <label className="sr-only" htmlFor="research-prompt">
            Research question
          </label>
          <textarea
            id="research-prompt"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setResearch(false);
            }}
            placeholder="What would challenge a defensive income view?"
          />
          <div className="composer-footer">
            <span>Research only · No live model</span>
            <Button
              primary
              disabled={!prompt.trim()}
              onClick={() => {
                setResearch(true);
                onToast(
                  "Opened a local research example. No model or service was called.",
                );
              }}
            >
              Show example
              <Icon name="arrow" size={16} />
            </Button>
          </div>
          <div className="prompt-chips">
            {[
              "What could reduce the income?",
              "Which sources are missing?",
            ].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPrompt(p);
                  setResearch(false);
                }}
              >
                {p}
                <Icon name="plus" size={13} />
              </button>
            ))}
          </div>
          {research && (
            <div className="research-answer">
              <p className="example-note">Fixed research example</p>
              <h3>Check the downside</h3>
              <p>
                Check how weaker earnings could affect the basket, which
                underlying could fall furthest and whether the issuer can repay.
                This is a fixed example with no external sources. It does not
                answer your question.
              </p>
              <button className="text-link" onClick={() => onOpen(ideas[0])}>
                Inspect the research example <Icon name="arrow" size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function Pipeline({
  onOpen,
  onBuild,
}: {
  onOpen: (i: Idea) => void;
  onBuild: () => void;
}) {
  const [filter, setFilter] = useState("All ideas");
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState("Board");
  const filtered = ideas.filter(
    (i) =>
      (filter === "All ideas" || i.category === filter) &&
      (i.title + " " + i.subtitle + " " + i.id)
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Opportunity pipeline</h1>
        </div>
        <Button primary onClick={onBuild}>
          <Icon name="plus" size={18} />
          New idea
        </Button>
      </div>
      <div className="toolbar">
        <div className="tab-group">
          {["All ideas", "Income", "Growth", "Defensive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "selected" : ""}
            >
              {f}
              {f === "All ideas" && <small>{ideas.length}</small>}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <label className="inline-search">
            <Icon name="search" size={17} />
            <input
              aria-label="Filter ideas"
              placeholder="Find an idea"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="segmented">
            {["Board", "List"].map((l) => (
              <button
                key={l}
                className={layout === l ? "selected" : ""}
                onClick={() => setLayout(l)}
                aria-pressed={layout === l}
              >
                <Icon name={l === "Board" ? "grid" : "filter"} size={17} />
                <span>{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <Icon name="search" size={28} />
          <h2>No ideas in this view</h2>
          <p>Try a different theme or search term.</p>
          <Button
            onClick={() => {
              setFilter("All ideas");
              setQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : layout === "Board" ? (
        <div className="kanban">
          {stages.map((s) => (
            <section key={s} className="kanban-column">
              <div className="kanban-head">
                <StageTag stage={s} />
                <span>{filtered.filter((i) => i.stage === s).length}</span>
              </div>
              {filtered
                .filter((i) => i.stage === s)
                .map((i) => (
                  <IdeaCard
                    key={i.id}
                    idea={i}
                    onOpen={onOpen}
                    showStage={false}
                  />
                ))}
              {!filtered.some((i) => i.stage === s) && (
                <div className="empty-lane">
                  No {s.toLowerCase()} ideas
                  <br />
                  in this view.
                </div>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Idea</th>
                <th>Stage</th>
                <th>Theme</th>
                <th>Draft tenor</th>
                <th>Evidence</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>
                    <button className="table-title" onClick={() => onOpen(i)}>
                      {i.title}
                      <small>
                        {i.id} · {i.subtitle}
                      </small>
                    </button>
                  </td>
                  <td>
                    <StageTag stage={i.stage} />
                  </td>
                  <td>{i.category}</td>
                  <td className="mono">{i.tenor} months</td>
                  <td>{i.coverage}</td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => onOpen(i)}
                      aria-label={`Open ${i.title}`}
                    >
                      <Icon name="arrow" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Note>
        This example pipeline does not request prices or contact clients.
      </Note>
    </>
  );
}
function IdeaDetail({
  idea,
  onBack,
  onBuild,
  onSave,
  saved,
  onClients,
}: {
  idea: Idea;
  onBack: () => void;
  onBuild: () => void;
  onSave: () => void;
  saved: boolean;
  onClients: () => void;
}) {
  const [tab, setTab] = useState("Research");
  return (
    <>
      <button className="back-link" onClick={onBack}>
        <Icon name="back" size={16} />
        Back to the desk
      </button>
      <div className="detail-heading">
        <div className="card-top">
          <span className="eyebrow">
            {idea.id} · {idea.category.toUpperCase()} THESIS
          </span>
          <StageTag stage={idea.stage} />
        </div>
        <h1>{idea.title}</h1>
        <p>{idea.subtitle}</p>
        <div className="detail-actions">
          <Button primary onClick={onBuild}>
            Open in idea builder
            <Icon name="arrow" size={17} />
          </Button>
          <Button onClick={onSave}>
            <Icon name={saved ? "check" : "plus"} size={17} />
            {saved ? "Saved to reading list" : "Save to reading list"}
          </Button>
        </div>
      </div>
      <div className="tab-group detail-tabs">
        {["Research", "Draft terms", "Evidence"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="detail-grid">
        <div>
          {tab === "Research" ? (
            <>
              <section className="article-section">
                <h2>Research thesis</h2>
                <p className="large-copy">{idea.thesis}</p>
              </section>
              <section className="article-section">
                <div className="two-up">
                  <div>
                    <h3>The catalyst</h3>
                    <p>
                      Stronger business results and clearer investment plans
                      could support this idea. Neither has been verified in this
                      example.
                    </p>
                  </div>
                  <div>
                    <h3>The bear case</h3>
                    <p>{idea.risk}</p>
                  </div>
                </div>
              </section>
              <section className="article-section">
                <ul className="evidence-list">
                  <li>
                    <div>
                      <strong>What could cause a loss?</strong>
                      <p>
                        Check how the weakest stock affects repayment and what
                        happens if the issuer cannot pay.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>What independent evidence is missing?</strong>
                      <p>
                        External filings, actual market observations and current
                        analyst sources are not connected.
                      </p>
                    </div>
                  </li>
                </ul>
              </section>
            </>
          ) : tab === "Draft terms" ? (
            <section className="article-section">
              <p className="eyebrow">No price obtained</p>
              <h2>Draft terms</h2>
              <TermsSummary
                terms={{
                  basket: idea.basket,
                  currency: idea.currency,
                  tenor: idea.tenor,
                  barrier: idea.barrier,
                  coupon: idea.coupon,
                  reoffer: 100,
                  family:
                    idea.id === "AV-010"
                      ? "Protected participation"
                      : "Autocallable",
                  solve: "Annual coupon",
                }}
              />
              <Note>
                These are example inputs. Open the builder to edit and review
                them. No price has been obtained.
              </Note>
            </section>
          ) : (
            <section className="article-section">
              <h2>Sources and missing evidence</h2>
              {[
                "Example research note",
                "Reason for the proposed structure",
                "Example purchase records",
                "Independent market source",
              ].map((s, i) => (
                <div className="evidence-row" key={s}>
                  <div>
                    <strong>{s}</strong>
                    <p>
                      {i < 3
                        ? "Written for this example on 12 November 2026. Not externally verified."
                        : "Not connected · requires independent verification"}
                    </p>
                  </div>
                  <Tag tone={i < 3 ? "neutral" : "amber"}>
                    {i < 3 ? "Example" : "Missing"}
                  </Tag>
                </div>
              ))}
              <Button onClick={onClients}>
                Explore historical context
                <Icon name="arrow" size={17} />
              </Button>
            </section>
          )}
        </div>
        <aside className="detail-aside">
          <p className="eyebrow">SUMMARY</p>
          <Basket ids={idea.basket} />
          <dl className="fact-list">
            <div>
              <dt>Currency</dt>
              <dd>{idea.currency}</dd>
            </div>
            <div>
              <dt>Draft tenor</dt>
              <dd>{idea.tenor} months</dd>
            </div>
            <div>
              <dt>Research coverage</dt>
              <dd>{idea.coverage}</dd>
            </div>
            <div>
              <dt>Snapshot</dt>
              <dd>12 Nov 2026</dd>
            </div>
            <div>
              <dt>Price status</dt>
              <dd>No price obtained</dd>
            </div>
          </dl>
          <Note>
            The instruments and research are fictional. This example is not a
            recommendation or an offer.
          </Note>
        </aside>
      </div>
    </>
  );
}
type Terms = {
  basket: string[];
  currency: string;
  tenor: number;
  barrier: number | string;
  coupon: number | string;
  reoffer: number | string;
  family: string;
  solve: string;
};
function TermsSummary({ terms }: { terms: Terms }) {
  return (
    <dl className="terms-list">
      <div>
        <dt>Product family</dt>
        <dd>{terms.family}</dd>
      </div>
      <div>
        <dt>Confirmed fictional listings</dt>
        <dd>
          {terms.basket.length ? (
            terms.basket.map((id) => (
              <span key={id}>
                {instruments.find((i) => i.id === id)?.name}
                <small>{id}</small>
              </span>
            ))
          ) : (
            <span className="danger-text">No listings selected</span>
          )}
        </dd>
      </div>
      <div>
        <dt>Currency / tenor</dt>
        <dd className="mono">
          {terms.currency} / {terms.tenor} months
        </dd>
      </div>
      <div>
        <dt>Annual coupon</dt>
        <dd className="mono">
          {terms.family === "Protected participation"
            ? "Not applicable"
            : terms.coupon === ""
              ? "Not entered"
              : `${terms.coupon}% p.a.`}
        </dd>
      </div>
      <div>
        <dt>Reoffer</dt>
        <dd className="mono">
          {terms.reoffer === ""
            ? "Not entered"
            : `${terms.reoffer}% of nominal`}
        </dd>
      </div>
      <div>
        <dt>
          {terms.family === "Protected participation"
            ? "Nominal protection"
            : "European maturity barrier"}
        </dt>
        <dd className="mono">
          {terms.family === "Protected participation"
            ? "100%"
            : terms.barrier === ""
              ? "Not entered"
              : `${terms.barrier}% of initial`}
        </dd>
      </div>
      <div>
        <dt>Value to calculate</dt>
        <dd>
          {terms.family === "Protected participation"
            ? "Reoffer only"
            : terms.solve}
        </dd>
      </div>
    </dl>
  );
}
function Builder({
  idea,
  onToast,
}: {
  idea: Idea;
  onToast: (s: string) => void;
}) {
  const initial: Terms = {
    basket: idea.basket,
    currency: idea.currency,
    tenor: idea.tenor,
    barrier: idea.id === "AV-010" ? 60 : idea.barrier,
    coupon: idea.coupon,
    reoffer: 100,
    family: idea.id === "AV-010" ? "Protected participation" : "Autocallable",
    solve: "Annual coupon",
  };
  const [terms, setTerms] = useState<Terms>(initial);
  const [review, setReview] = useState<string | null>(null);
  const [invalidated, setInvalidated] = useState(false);
  const [checked, setChecked] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [savedReview, setSavedReview] = useState(false);
  const update = (patch: Partial<Terms>) => {
    if (review || savedReview) setInvalidated(true);
    setReview(null);
    setSavedReview(false);
    setChecked(false);
    setTerms((t) => ({ ...t, ...patch }));
  };
  const errors = validateTerms(terms);
  const draftOnly =
    terms.family === "Capital-at-risk participation" ||
    terms.family === "Reverse autocallable";
  const reviewed = isReviewCurrent(terms, review);
  const download = () => {
    const blob = new Blob(
      [JSON.stringify(createDraftExport(terms, review, savedReview), null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alphaville-synthetic-draft.json";
    a.click();
    URL.revokeObjectURL(url);
    onToast("Draft exported to your device");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Idea builder</h1>
          <p>Edit the terms, then review this draft</p>
        </div>
        <Button onClick={download}>
          <Icon name="download" size={17} />
          Export draft
        </Button>
      </div>
      <div
        className="builder-progress"
        role="group"
        aria-label="Draft workflow"
      >
        {[
          { label: "Assemble", done: reviewed, current: !reviewed },
          {
            label: "Review terms",
            done: savedReview,
            current: reviewed && !savedReview,
          },
          { label: "Save review", done: savedReview, current: false },
        ].map(({ label, done, current }) => (
          <span
            key={label}
            className={done ? "complete" : current ? "current" : ""}
            aria-current={current ? "step" : undefined}
            aria-label={`${label}${done ? ", complete" : current ? ", current" : ", pending"}`}
          >
            <span className="workflow-state" aria-hidden="true">
              {done ? <Icon name="check" size={14} /> : <i />}
            </span>
            {label}
          </span>
        ))}
        <span className="connection-note">Pricing is not connected</span>
      </div>
      {invalidated && (
        <div className="alert amber" role="status">
          <Icon name="info" />
          <div>
            <strong>Review cleared after your changes</strong>
            <p>Check the updated terms before saving another review.</p>
          </div>
        </div>
      )}
      <div className="builder-grid">
        <div className="builder-form">
          <section className="form-section">
            <SectionHeading title="Choose the structure" />
            <div className="form-grid">
              <label>
                Product family
                <span className="select-shell">
                  <select
                    value={terms.family}
                    onChange={(e) =>
                      update({
                        family: e.target.value,
                        ...(e.target.value === "Protected participation"
                          ? {
                              basket: terms.basket.slice(0, 1),
                              solve: "Reoffer",
                            }
                          : {}),
                      })
                    }
                  >
                    <option>Autocallable</option>
                    <option>Protected participation</option>
                    <option>Capital-at-risk participation</option>
                    <option>Reverse autocallable</option>
                  </select>
                  <Icon name="down" size={14} />
                </span>
              </label>
              <label>
                Currency
                <span className="select-shell">
                  <select
                    value={terms.currency}
                    onChange={(e) => update({ currency: e.target.value })}
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                  <Icon name="down" size={14} />
                </span>
              </label>
            </div>
            {draftOnly && (
              <Note>
                This branch is draft-only. Pricing is unavailable for this
                product family.
              </Note>
            )}
            {terms.family === "Protected participation" && (
              <Note>
                This example follows gains in one stock with no cap (CALL
                participation). It has no coupon and would calculate Reoffer
                only. Protection applies to nominal at maturity, subject to the
                issuer’s ability to pay. It does not cover a premium paid above
                nominal.
              </Note>
            )}
          </section>
          <section className="form-section">
            <SectionHeading title="Define the basket" />
            <p className="form-caption">
              Choose from these fictional listings. No real instruments are
              connected.
            </p>
            <div className="instrument-options">
              {instruments.map((i) => (
                <label
                  key={i.id}
                  className={`instrument-option ${terms.basket.includes(i.id) ? "chosen" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={terms.basket.includes(i.id)}
                    onChange={() =>
                      update({
                        basket: terms.basket.includes(i.id)
                          ? terms.basket.filter((id) => id !== i.id)
                          : [...terms.basket, i.id],
                      })
                    }
                  />
                  <span className="instrument-avatar">{i.initial}</span>
                  <span>
                    <strong>{i.name}</strong>
                    <small>
                      {i.id} · {i.sector}
                    </small>
                  </span>
                  <span className="listing-status">
                    <Icon name="check" size={13} />
                    Fictional
                  </span>
                </label>
              ))}
            </div>
          </section>
          <section className="form-section">
            <SectionHeading title="Set the material terms" />
            <div className="form-grid">
              <label>
                Tenor
                <span className="select-shell">
                  <select
                    value={terms.tenor}
                    onChange={(e) => update({ tenor: Number(e.target.value) })}
                  >
                    {[12, 18, 24, 36].map((t) => (
                      <option key={t} value={t}>
                        {t} months
                      </option>
                    ))}
                  </select>
                  <Icon name="down" size={14} />
                </span>
              </label>
              <label>
                {terms.family === "Protected participation"
                  ? "Nominal protection"
                  : "European maturity barrier"}
                <div className="input-unit">
                  <input
                    type="number"
                    aria-label="European maturity barrier"
                    min="40"
                    max="95"
                    value={
                      terms.family === "Protected participation"
                        ? 100
                        : terms.barrier
                    }
                    disabled={terms.family === "Protected participation"}
                    onChange={(e) => update({ barrier: e.target.value })}
                  />
                  <span>%</span>
                </div>
                <small>
                  {terms.family === "Protected participation"
                    ? "At maturity, subject to issuer and contract risk"
                    : "40 to 95% of the starting level, checked at maturity"}
                </small>
              </label>
              <label>
                Annual coupon
                <div className="input-unit">
                  <input
                    type="number"
                    aria-label="Annual coupon"
                    min="0"
                    max="20"
                    step="0.1"
                    value={
                      terms.family === "Protected participation"
                        ? ""
                        : terms.coupon
                    }
                    disabled={terms.family === "Protected participation"}
                    placeholder="Not applicable"
                    onChange={(e) => update({ coupon: e.target.value })}
                  />
                  <span>% p.a.</span>
                </div>
                <small>Yearly coupon rate entered for this example</small>
              </label>
              <label>
                Reoffer
                <div className="input-unit">
                  <input
                    type="number"
                    aria-label="Reoffer"
                    min="80"
                    max="100"
                    step="0.1"
                    value={terms.reoffer}
                    onChange={(e) => update({ reoffer: e.target.value })}
                  />
                  <span>%</span>
                </div>
                <small>
                  Price as a percentage of the note’s reference amount
                </small>
              </label>
            </div>
            {terms.family !== "Protected participation" && (
              <>
                <div className="field-label">
                  Value to calculate <span>(not connected)</span>
                </div>
                <div className="choice-row">
                  {["Annual coupon", "Reoffer"].map((v) => (
                    <button
                      key={v}
                      className={terms.solve === v ? "chosen" : ""}
                      onClick={() => update({ solve: v })}
                    >
                      <span className="radio-dot" />
                      <span>
                        <strong>{v}</strong>
                        <small>
                          {v === "Annual coupon"
                            ? "Reoffer would be fixed"
                            : "Annual coupon would be fixed"}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {terms.family === "Autocallable" && (
              <Note>
                This example checks for early repayment every three months,
                starting at month 6. All stocks must reach 100% of their
                starting levels. The downside barrier is checked at maturity.
                You can lose principal.
              </Note>
            )}
          </section>
        </div>
        <aside className="term-sheet">
          <div className="term-sheet-header">
            <Tag
              tone={savedReview ? "evidence" : reviewed ? "review" : "draft"}
            >
              {savedReview
                ? "Reviewed example"
                : reviewed
                  ? "Terms captured"
                  : "Draft · unpriced"}
            </Tag>
          </div>
          <h2>Draft terms</h2>
          <TermsSummary terms={terms} />
          {attempted && errors.length > 0 && (
            <div className="field-errors" role="alert">
              <strong>Check these terms</strong>
              <ul>
                {errors.map((e: string) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          {!reviewed ? (
            <Button
              primary
              onClick={() => {
                setAttempted(true);
                if (!errors.length) {
                  setReview(bindTerms(terms));
                  setInvalidated(false);
                  onToast(
                    "Exact draft terms captured for local review. No pricing request was made.",
                  );
                }
              }}
            >
              Review exact terms
              <Icon name="arrow" size={17} />
            </Button>
          ) : (
            <div className="review-box">
              <div className="review-banner">
                <Icon name="check" size={18} />
                <strong>Terms ready to check</strong>
              </div>
              <p>
                Check the terms above. Your saved review applies only to these
                inputs.
              </p>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span>
                  I have checked these example terms and the risk of losing
                  principal.
                </span>
              </label>
              <Button
                primary
                disabled={!checked || savedReview}
                onClick={() => {
                  setSavedReview(true);
                  onToast(
                    "Review saved for this session. No quote, order or external communication was created.",
                  );
                }}
              >
                {savedReview ? (
                  <>
                    <Icon name="check" size={17} />
                    Review saved
                  </>
                ) : (
                  "Save review"
                )}
              </Button>
            </div>
          )}
          <p className="sheet-footnote">
            Changing the terms clears the review. Saving here does not request a
            price or place an order.
          </p>
        </aside>
      </div>
    </>
  );
}

function ClientEvidence() {
  const [book, setBook] = useState("");
  const [currency, setCurrency] = useState("All currencies");
  const [region, setRegion] = useState("All regions");
  const [active, setActive] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [query, setQuery] = useState("");
  const filterChange = () => {
    setActive(false);
    setClient(null);
  };
  const shown = clients.filter(
    (c) =>
      c.book === book &&
      (currency === "All currencies" || c.currency === currency) &&
      (region === "All regions" || c.region === region) &&
      c.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Client evidence</h1>
        </div>
        <span className="snapshot-date">Data as of 31 Oct 2026</span>
      </div>
      <div className="evidence-banner">
        <Icon name="book" size={24} />
        <div>
          <p>
            These fictional records show past purchases. They do not show what
            clients own now or whether an idea suits them, and do not give
            permission to contact them.
          </p>
        </div>
      </div>
      <div className="client-filters">
        <label>
          Historical book
          <span className="select-shell">
            <select
              value={book}
              onChange={(e) => {
                setBook(e.target.value);
                filterChange();
              }}
            >
              <option value="">Choose a demo book</option>
              <option>Demo book A</option>
              <option>Demo book B</option>
            </select>
            <Icon name="down" size={14} />
          </span>
        </label>
        <label>
          Currency
          <span className="select-shell">
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                filterChange();
              }}
            >
              <option>All currencies</option>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <Icon name="down" size={14} />
          </span>
        </label>
        <label>
          Region
          <span className="select-shell">
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                filterChange();
              }}
            >
              <option>All regions</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
            </select>
            <Icon name="down" size={14} />
          </span>
        </label>
        <Button primary disabled={!book} onClick={() => setActive(true)}>
          Load records
          <Icon name="arrow" size={17} />
        </Button>
      </div>
      {!active ? (
        <div className="empty-state client-empty">
          <div className="empty-symbol">
            <Icon name="clients" size={36} />
          </div>
          <h2>
            {book ? "Load the selected records" : "Choose a historical book"}
          </h2>
          <p>
            {book
              ? "Click Load records to show the selected book. Previous results have been cleared."
              : "Select a book above to see its fictional purchase records."}
          </p>
        </div>
      ) : (
        <>
          <div className="client-summary">
            <div>
              <span>Recorded purchases</span>
              <strong>{shown.reduce((a, c) => a + c.count, 0)}</strong>
            </div>
            <div>
              <span>Fictional profiles</span>
              <strong>{shown.length}</strong>
            </div>
            <div>
              <span>Profiles with full coverage</span>
              <strong>{shown.filter((c) => c.coverage === 4).length}</strong>
            </div>
            <div>
              <span>Comparison basis</span>
              <strong className="text-stat">Historical activity</strong>
              <small>Not holdings or probability</small>
            </div>
          </div>
          <SectionHeading title="The historical book">
            <label className="inline-search">
              <Icon name="search" size={17} />
              <input
                placeholder="Find a profile"
                aria-label="Search fictional profiles"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setClient(null);
                }}
              />
            </label>
          </SectionHeading>
          <div className={`client-content ${client ? "with-inspector" : ""}`}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fictional profile</th>
                    <th>Similarity</th>
                    <th>Purchases</th>
                    <th>Coverage</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((c) => (
                    <tr
                      key={c.id}
                      className={client?.id === c.id ? "row-selected" : ""}
                    >
                      <td>
                        <button
                          className="table-title"
                          onClick={() => setClient(c)}
                        >
                          {c.name}
                          <small>
                            {c.region} · {c.currency}
                          </small>
                        </button>
                      </td>
                      <td>
                        {c.score === null ? (
                          <Tag>Unrankable</Tag>
                        ) : (
                          <div className="score-cell">
                            <strong>
                              {c.score}
                              <small>/100</small>
                            </strong>
                            <span>
                              <i style={{ width: `${c.score}%` }} />
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="mono">{c.count}</td>
                      <td>
                        <span
                          className="coverage-dots"
                          aria-label={`${c.coverage} of 4 factors`}
                        >
                          {[0, 1, 2, 3].map((n) => (
                            <i
                              key={n}
                              className={n < c.coverage ? "filled" : ""}
                            />
                          ))}
                        </span>
                        <small className="coverage-caption">
                          {c.coverage}/4 factors
                        </small>
                      </td>
                      <td>
                        <button
                          className="icon-button"
                          onClick={() => setClient(c)}
                          aria-label={`Inspect ${c.name}`}
                        >
                          <Icon name="arrow" size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!shown.length && (
                <div className="empty-state">
                  <h3>No records in this scope</h3>
                  <p>Try a different book, currency, region or name.</p>
                </div>
              )}
            </div>
            {client && (
              <aside className="client-inspector">
                <div className="card-top">
                  <p className="eyebrow">PROFILE / {client.id}</p>
                  <button
                    className="icon-button"
                    onClick={() => setClient(null)}
                    aria-label="Close profile"
                  >
                    <Icon name="close" size={17} />
                  </button>
                </div>
                <div className="profile-monogram">
                  {client.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h2>{client.name}</h2>
                <p>
                  {client.region} · {client.book}
                </p>
                <dl className="fact-list">
                  <div>
                    <dt>Historical similarity</dt>
                    <dd>
                      {client.score === null
                        ? "Unrankable"
                        : `${client.score}/100`}
                    </dd>
                  </div>
                  <div>
                    <dt>Last recorded purchase</dt>
                    <dd>{client.last}</dd>
                  </div>
                  <div>
                    <dt>Estimated scheduled maturity</dt>
                    <dd>{client.maturity}</dd>
                  </div>
                  <div>
                    <dt>Recorded purchases</dt>
                    <dd>{client.count}</dd>
                  </div>
                </dl>
                <p className="eyebrow">RECORDED COMPARISON FACTORS</p>
                {[
                  "Product family",
                  "Original tenor",
                  "Currency",
                  "Underlying overlap",
                ].map((s, i) => (
                  <div className="factor" key={s}>
                    <span>{s}</span>
                    <Tag tone={i < client.coverage ? "evidence" : "amber"}>
                      {i < client.coverage ? "Recorded" : "Missing"}
                    </Tag>
                  </div>
                ))}
                <Note>
                  Estimated maturity uses the purchase date and original term.
                  The product may already have repaid early or been sold.
                  Missing records remain marked as missing.
                </Note>
              </aside>
            )}
          </div>
          <Note>
            {currency === "All currencies"
              ? "All currencies are included in this view."
              : "Only records in the selected currency are shown."}{" "}
            The scores were written for this example. No matching service
            calculated them.
          </Note>
        </>
      )}
    </>
  );
}

function Analytics() {
  const [scenario, setScenario] = useState("At maturity");
  const [coupon, setCoupon] = useState("8");
  const [barrier, setBarrier] = useState("60");
  const [level, setLevel] = useState("80");
  const [result, setResult] =
    useState<ReturnType<typeof scenarioCashflows>>(null);
  const [stale, setStale] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const edit = () => {
    if (result) setStale(true);
    setResult(null);
    setAttempted(false);
  };
  const run = () => {
    setAttempted(true);
    setResult(
      scenarioCashflows(
        coupon,
        barrier,
        level,
        8,
        scenario === "Autocall at month 12" ? 4 : null,
      ),
    );
    setStale(false);
  };
  const total = result?.reduce(
    (a: number, r: { total: number }) => a + r.total,
    0,
  );
  const principal = result?.reduce(
    (a: number, r: { principal: number }) => a + r.principal,
    0,
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Cash-flow scenarios</h1>
          <p>Calculate payments under a set of assumptions</p>
        </div>
      </div>
      <div className="analytics-grid">
        <section className="scenario-controls">
          <h2>Scenario inputs</h2>
          <label>
            Observation scenario
            <span className="select-shell">
              <select
                value={scenario}
                onChange={(e) => {
                  edit();
                  setScenario(e.target.value);
                }}
              >
                <option>At maturity</option>
                <option>Autocall at month 12</option>
              </select>
              <Icon name="down" size={14} />
            </span>
          </label>
          <label>
            Guaranteed annual coupon
            <div className="input-unit">
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={coupon}
                onChange={(e) => {
                  edit();
                  setCoupon(e.target.value);
                }}
              />
              <span>% p.a.</span>
            </div>
          </label>
          <label>
            European maturity barrier
            <div className="input-unit">
              <input
                type="number"
                min="40"
                max="95"
                value={barrier}
                onChange={(e) => {
                  edit();
                  setBarrier(e.target.value);
                }}
              />
              <span>%</span>
            </div>
          </label>
          <label>
            Worst underlying at maturity
            <div className="input-unit">
              <input
                type="number"
                min="0"
                max="160"
                value={level}
                disabled={scenario === "Autocall at month 12"}
                onChange={(e) => {
                  edit();
                  setLevel(e.target.value);
                }}
              />
              <span>% of initial</span>
            </div>
          </label>
          <Button primary onClick={run}>
            Calculate local scenario
            <Icon name="arrow" size={17} />
          </Button>
          <p className="form-caption">
            24-month term. Quarterly equal coupons. 100% strike, autocall
            trigger and downside leverage. All names meet the trigger in the
            autocall example.
          </p>
          <Note>
            Coupons stop after redemption. A final level equal to the barrier
            does not trigger a principal loss. Excludes issuer default, fees,
            tax and actual day counts.
          </Note>
        </section>
        <section className="scenario-results">
          <SectionHeading title="Cash flows">
            <span className="mono">% OF NOMINAL</span>
          </SectionHeading>
          {!result ? (
            <div className="empty-state chart-empty">
              <Icon name="chart" size={45} />
              <h2>{stale ? "Inputs changed" : "Calculate a scenario"}</h2>
              <p>
                {stale
                  ? "Your changes cleared the previous result. Calculate again using the updated inputs."
                  : "Enter assumptions to calculate the payments in this example."}
              </p>
              {attempted && (
                <div className="field-errors" role="alert">
                  Enter all values. Coupon must be 0 to 20%, barrier 40 to 95%,
                  and underlying level 0 to 160%. A blank field is not zero.
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="scenario-totals">
                <div>
                  <span>Total contractual cash flows</span>
                  <strong>
                    {total?.toFixed(2)}
                    <small>%</small>
                  </strong>
                </div>
                <div>
                  <span>Principal repaid</span>
                  <strong>
                    {principal?.toFixed(0)}
                    <small>%</small>
                  </strong>
                </div>
                <Tag tone={principal === 100 ? "evidence" : "amber"}>
                  {principal === 100 ? "Nominal repaid" : "Principal loss"}
                </Tag>
              </div>
              <div
                className="cashflow-chart"
                role="img"
                aria-label={`Quarterly cash flows. ${result.length} payments, total ${total?.toFixed(2)} percent of nominal.`}
              >
                <div className="chart-y">
                  <span>110%</span>
                  <span>55%</span>
                  <span>0%</span>
                </div>
                <div className="cashflow-bars">
                  {result.map(
                    (r: {
                      quarter: number;
                      coupon: number;
                      principal: number;
                      total: number;
                    }) => (
                      <div className="cashflow-column" key={r.quarter}>
                        <div
                          className="bar-stack"
                          style={{ height: `${(r.total / 110) * 100}%` }}
                          title={`Q${r.quarter}: ${r.total}% of nominal`}
                        >
                          {r.principal > 0 && (
                            <span
                              className="bar-principal"
                              style={{ flex: r.principal }}
                            />
                          )}
                          <span
                            className="bar-coupon"
                            style={{ flex: r.coupon || 0.001 }}
                          />
                        </div>
                        <span className="bar-label">Q{r.quarter}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="legend-principal" />
                  Principal
                </span>
                <span>
                  <i className="legend-coupon" />
                  Coupon
                </span>
                <span>Exact values below</span>
              </div>
              <div className="table-wrap cashflow-table">
                <table>
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Coupon</th>
                      <th>Principal</th>
                      <th>Total cash flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map(
                      (r: {
                        quarter: number;
                        coupon: number;
                        principal: number;
                        total: number;
                      }) => (
                        <tr key={r.quarter}>
                          <td>Quarter {r.quarter}</td>
                          <td className="mono">{r.coupon.toFixed(2)}%</td>
                          <td className="mono">{r.principal.toFixed(2)}%</td>
                          <td className="mono">{r.total.toFixed(2)}%</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
              <Note>
                Amounts are shown as percentages of nominal, the reference
                amount used to calculate payments. They do not measure your
                return on the purchase price. The chart and table use the same
                data.
              </Note>
            </>
          )}
        </section>
      </div>
    </>
  );
}
function DesignSystem({
  theme,
  onTheme,
  onToast,
}: {
  theme: string;
  onTheme: () => void;
  onToast: (s: string) => void;
}) {
  const [state, setState] = useState("Partial");
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Design system</h1>
        </div>
        <Button onClick={onTheme}>
          <Icon name={theme === "day" ? "moon" : "sun"} size={17} />
          View {theme === "day" ? "Night" : "Day"}
        </Button>
      </div>
      <div className="system-manifesto">
        <span className="giant-a">Aa.</span>
        <div>
          <h2>Type, color and layout</h2>
          <p>
            Use headings and rules to group information. Use color to identify
            actions and status, with text explaining each state.
          </p>
        </div>
      </div>
      <SectionHeading title="Colors and type" />
      <div className="swatch-grid">
        {[
          ["Paper", "--paper", theme === "night" ? "#171C1A" : "#F7F7F2"],
          ["Ink", "--ink", theme === "night" ? "#F1F2E9" : "#232722"],
          ["Signal", "--accent", theme === "night" ? "#AAA4FF" : "#5653D8"],
          ["Evidence", "--success", theme === "night" ? "#A3CBB0" : "#356B4F"],
          ["Attention", "--warning", theme === "night" ? "#E6C588" : "#855B20"],
          ["Critical", "--danger", theme === "night" ? "#EAA4A4" : "#A34142"],
        ].map(([label, token, hex]) => (
          <div className="swatch" key={label}>
            <div style={{ background: `var(${token})` }} />
            <strong>{label}</strong>
            <span className="mono">{hex}</span>
            <small>{token}</small>
          </div>
        ))}
      </div>
      <div className="type-specimens">
        <div>
          <span className="eyebrow">DISPLAY / OUTFIT / 600 TO 700</span>
          <h2>Headings and numbers</h2>
          <p>
            48 / 50 · −0.04em
            <br />
            Headlines, section titles, major numbers.
          </p>
        </div>
        <div>
          <span className="eyebrow">BODY / FIGTREE / 400 TO 700</span>
          <h3>Body text</h3>
          <p>
            16 / 24 for body text. 14 / 20 for dense controls. Keep the
            financial qualification beside the number it qualifies.
          </p>
          <em>Use italics for short captions.</em>
          <div className="mono specimen-mono">
            DATA / UI MONOSPACE
            <br />
            USD 100.00 · AV-014 · 12 NOV 2026
          </div>
        </div>
      </div>
      <SectionHeading title="Shared components" />
      <div className="component-specimens">
        <section>
          <h3>Actions & hierarchy</h3>
          <div className="specimen-actions">
            <Button
              primary
              onClick={() =>
                onToast(
                  "Primary action example activated. No external action occurred.",
                )
              }
            >
              Primary action
              <Icon name="arrow" size={16} />
            </Button>
            <Button
              onClick={() => onToast("Secondary action example activated.")}
            >
              Secondary action
            </Button>
            <Button disabled>Unavailable action</Button>
          </div>
          <p>
            One primary action per decision. Buttons have visible keyboard focus
            and explicit disabled states.
          </p>
        </section>
        <section>
          <h3>Status labels</h3>
          <div className="specimen-tags">
            {stages.map((s) => (
              <StageTag key={s} stage={s} />
            ))}
            <Tag tone="amber">Partial coverage</Tag>
            <Tag tone="danger">Validation error</Tag>
            <Tag>Unrankable</Tag>
          </div>
          <p>
            Label each status in words. Show missing values as unavailable.
            Display counts without leading zeros.
          </p>
        </section>
      </div>
      <SectionHeading title="State vocabulary" />
      <div className="state-gallery">
        <div className="state-selector">
          {[
            "Incomplete",
            "Ready",
            "Historical",
            "Partial",
            "Empty",
            "Unrankable",
            "Stale",
            "Failed",
            "Unknown",
            "Unavailable",
          ].map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={state === s ? "selected" : ""}
            >
              {s}
              <Icon name="arrow" size={16} />
            </button>
          ))}
        </div>
        <div className="state-preview">
          <span className="eyebrow">
            COMPONENT STATE / {state.toUpperCase()}
          </span>
          <Icon
            name={
              state === "Ready"
                ? "check"
                : state === "Historical"
                  ? "clock"
                  : "info"
            }
            size={34}
          />
          <h2>
            {
              {
                Incomplete: "A listing is missing",
                Ready: "Draft ready for review",
                Historical: "Historical purchase records",
                Partial: "Some records are missing",
                Empty: "No matching records",
                Unrankable: "Not enough records for a score",
                Stale: "Inputs changed",
                Failed: "Request failed",
                Unknown: "Status unknown",
                Unavailable: "Service unavailable",
              }[state]
            }
          </h2>
          <p>
            {
              {
                Incomplete:
                  "Choose a confirmed listing before continuing. Typing a company name does not confirm its instrument.",
                Ready:
                  "The required fields are complete. The draft still needs review and has no price.",
                Historical:
                  "Show the record date. Past purchases do not establish current holdings.",
                Partial:
                  "Three of four comparison factors are recorded. The fourth is shown as missing.",
                Empty:
                  "No records match the current filters. Change the filters or return to the workspace.",
                Unrankable:
                  "Display unavailable scores separately from ranked records.",
                Stale:
                  "Changing inputs clears the old result. Review the updated terms.",
                Failed:
                  "Keep the draft and explain how to recover from the failed request.",
                Unknown:
                  "Check whether the original request completed before sending another one. This is a screen example with no connected service.",
                Unavailable:
                  "This prototype cannot create documents, obtain prices, send messages, run external research or place orders.",
              }[state]
            }
          </p>
          <Tag
            tone={
              ["Partial", "Stale", "Unknown"].includes(state)
                ? "amber"
                : state === "Failed"
                  ? "danger"
                  : "neutral"
            }
          >
            {state}
          </Tag>
        </div>
      </div>
      <SectionHeading title="Prototype features and limits" />
      <div className="system-rules">
        {[
          [
            "Page layout",
            "Use headings, spacing and rules to guide the reader. Do not number sections or lists for decoration. Keep numbers when they identify records, show values or explain a necessary order.",
          ],
          [
            "Keyboard and reading support",
            "Controls work with the keyboard and show focus. Inputs have labels. Status includes text, and motion stops when the person requests reduced motion.",
          ],
          [
            "Disconnected services",
            "Fictional example data only. The prototype cannot obtain prices, assess suitability, place orders or send information outside this workspace.",
          ],
        ].map(([title, body]) => (
          <div key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
