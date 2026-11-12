/** Original Alphaville line symbols. No third-party icon assets are used. */
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    // A research folio: one lead column and a narrow evidence column.
    desk: (
      <>
        <path d="M3 4.5h18v15H3zM3 8.5h18M14.5 8.5v11M6 12h5M6 15.5h5M17 12h1M17 15.5h1" />
        <path d="M6 6.5h5" strokeWidth="2" />
      </>
    ),
    grid: (
      <>
        <path d="M3.5 4.5h7v15h-7zM13.5 4.5h7v9h-7zM13.5 16.5h7v3h-7z" />
      </>
    ),
    // Four review stages with a single routed line through the process.
    pipeline: (
      <>
        <path d="M4 4v16M10 4v16M16 4v16M21 4v16" opacity=".3" />
        <path d="M4 16h6v-5h6V7h5" />
        <path
          d="M2.5 14.5h3v3h-3zM8.5 9.5h3v3h-3zM14.5 5.5h3v3h-3z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
    // A term sheet with explicit fixed and variable values.
    layers: (
      <>
        <path d="M4 3.5h12l4 4v13H4zM16 3.5v4h4M7 8h5M7 12h3M14 12h3M7 16h3" />
        <path d="M13.5 16h4M15.5 14v4" />
      </>
    ),
    // Purchase history as a ledger, not a generic group of people.
    clients: (
      <>
        <path d="M3 4.5h18v15H3zM3 9.5h18M8 4.5v15M8 14.5h13" />
        <path d="M11 7h7M11 12h4M11 17h6" />
        <path d="M5.5 7h.1M5.5 12h.1M5.5 17h.1" strokeWidth="2.5" />
      </>
    ),
    // Contractual payoff profile with a marked threshold.
    chart: (
      <>
        <path d="M3.5 3v17.5H21M3.5 13.5H21" opacity=".35" />
        <path d="M11.5 4v16.5" strokeDasharray="1.5 2.5" opacity=".5" />
        <path d="m4 18 7.5-8H21" strokeWidth="1.8" />
        <path d="M10 8.5h3v3h-3z" fill="currentColor" stroke="none" />
      </>
    ),
    // Type and rules from the Alphaville editorial system.
    palette: (
      <>
        <path d="m3 17 4-12 4 12M4.5 13h5M15 5h6M15 9h4M15 13h6M3 21h18" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
    up: <path d="M6 18 18 6M7 6h11v11" />,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4.5 4.5L19 7" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    down: <path d="m5 9 7 7 7-7" />,
    back: <path d="m14 5-7 7 7 7" />,
    clock: (
      <>
        <path d="M8 3.8A8.5 8.5 0 1 1 3.8 8M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    book: (
      <>
        <path d="M4 3.5h12l4 4v13H4zM16 3.5v4h4M7 8h5M7 12h10M7 16h7" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
      </>
    ),
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5" />
      </>
    ),
    info: (
      <>
        <path d="M4 4h16v16H4zM12 10v6M12 7v.5" />
      </>
    ),
    bell: (
      <>
        <path d="M6 16V9a6 6 0 0 1 12 0v7M4 17h16M10 21h4M12 2V1" />
      </>
    ),
    filter: (
      <>
        <path d="M4 5.5h16M4 12h16M4 18.5h16M8 3.5v4M16 10v4M10 16.5v4" />
      </>
    ),
  };
  return (
    <svg
      className={`app-icon icon-${name}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {paths[name] ?? paths.desk}
    </svg>
  );
}
