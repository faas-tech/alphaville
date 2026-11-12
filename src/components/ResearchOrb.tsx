"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ResearchOrb.module.css";

const CENTER = 200;
const ORBIT_PATH = "M302 200 A102 50 0 1 1 98 200 A102 50 0 1 1 302 200";
const PLANES = [
  { angle: -32, duration: 12, tiltDuration: 29, phase: 0 },
  { angle: 32, duration: 16, tiltDuration: 37, phase: 0.34 },
  { angle: 90, duration: 20, tiltDuration: 43, phase: 0.68 },
];

/**
 * Decorative, self-contained SVG. The alpha and labels never move.
 * SMIL starts only after the motion preference is known. One SVG clock keeps
 * the satellites, trails and orbit tilts together when paused or resumed.
 */
export function ResearchOrb() {
  const titleId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const started = useRef(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setMotionAllowed(!preference.matches);
    const syncVisibility = () => setTabVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (figureRef.current) observer.observe(figureRef.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  const running = motionAllowed && !paused && inView && tabVisible;
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (!running) {
      svg.pauseAnimations();
      return;
    }
    if (!started.current) {
      svg
        .querySelectorAll<SVGAnimationElement>("[data-orbit-animation]")
        .forEach((animation) => animation.beginElement());
      started.current = true;
    }
    svg.unpauseAnimations();
  }, [running]);

  return (
    <figure ref={figureRef} className={styles.figure}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox="0 0 400 400"
        width="400"
        height="400"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          Alphaville alpha with three orbits for view, structure and evidence
        </title>
        {PLANES.map(({ angle, duration, tiltDuration, phase }) => {
          const dx = 102 * Math.cos(phase * 2 * Math.PI);
          const dy = 50 * Math.sin(phase * 2 * Math.PI);
          const trailPath = `M${CENTER + dx} ${CENTER + dy} A102 50 0 1 1 ${CENTER - dx} ${CENTER - dy} A102 50 0 1 1 ${CENTER + dx} ${CENTER + dy}`;
          const motionPath = `M0 0 A102 50 0 1 1 ${-2 * dx} ${-2 * dy} A102 50 0 1 1 0 0`;
          return (
            <g key={angle} transform={`rotate(${angle} ${CENTER} ${CENTER})`}>
              <g>
                <animateTransform
                  data-orbit-animation=""
                  attributeName="transform"
                  type="rotate"
                  values={`0 ${CENTER} ${CENTER};5 ${CENTER} ${CENTER};0 ${CENTER} ${CENTER};-5 ${CENTER} ${CENTER};0 ${CENTER} ${CENTER}`}
                  dur={`${tiltDuration}s`}
                  begin="indefinite"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.25;0.5;0.75;1"
                  keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
                />
                <path className={styles.track} d={ORBIT_PATH} />
                <path
                  className={styles.trail}
                  d={trailPath}
                  pathLength="100"
                  strokeDasharray="9 91"
                  strokeDashoffset="9"
                >
                  <animate
                    data-orbit-animation=""
                    attributeName="stroke-dashoffset"
                    from="9"
                    to="-91"
                    dur={`${duration}s`}
                    begin="indefinite"
                    repeatCount="indefinite"
                  />
                </path>
                <circle
                  className={styles.satellite}
                  r="3.5"
                  cx="0"
                  cy="0"
                  transform={`translate(${CENTER + dx} ${CENTER + dy})`}
                >
                  <animateMotion
                    data-orbit-animation=""
                    path={motionPath}
                    dur={`${duration}s`}
                    begin="indefinite"
                    repeatCount="indefinite"
                    calcMode="paced"
                    additive="replace"
                  />
                </circle>
              </g>
            </g>
          );
        })}
        <g className={styles.alpha} transform="translate(162 148) scale(.95)">
          <path
            fillRule="evenodd"
            d="M61 20H74L60 67C58 75 59 80 64 80C68 80 72 75 75 69L79 71C74 84 68 91 60 91C51 91 47 85 47 76C39 86 31 91 22 91C5 91-1 76 4 54C8 33 21 18 36 18C48 18 54 24 56 33ZM36 26C26 26 18 39 14 56C10 73 13 83 23 83C35 83 45 67 50 47C53 34 48 26 36 26Z"
          />
        </g>
        <g className={styles.labels} textAnchor="middle">
          <text x="200" y="58">
            VIEW
          </text>
          <text x="77" y="329">
            STRUCTURE
          </text>
          <text x="323" y="329">
            EVIDENCE
          </text>
        </g>
      </svg>
      <button
        className={styles.control}
        type="button"
        disabled={!motionAllowed}
        onClick={() => setPaused((value) => !value)}
        aria-label={
          !motionAllowed
            ? "Animation off because reduced motion is enabled"
            : paused
              ? "Play orbit animation"
              : "Pause orbit animation"
        }
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          {paused || !motionAllowed ? (
            <path d="m4 2 6 4-6 4Z" fill="currentColor" />
          ) : (
            <path
              d="M3.5 2v8M8.5 2v8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          )}
        </svg>
        <span>
          {!motionAllowed
            ? "Motion off"
            : paused
              ? "Play motion"
              : "Pause motion"}
        </span>
      </button>
    </figure>
  );
}
