"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAreaForZip, getPlaceholderZipMatchCount, normalizeZip, type LocationArea } from "@/lib/locations";

type LocationZipHeroCardProps = {
  fallbackAreas: LocationArea[];
};

type ZipCardState = "input" | "loading" | "success" | "lead";

type LeadCaptureState = {
  status: "idle" | "loading" | "error";
  message: string;
};

const loadingStatusLines = [
  "🌎 Detecting your location...",
  "🔍 Finding chiropractors near you...",
  "⭐ Sorting by best match...",
  "🛡️ Checking insurance compatibility...",
  "✅ Customizing your results..."
];

const loadingDurationMs = 8000;
const loadingHoldMs = 500;
const loadingExitMs = 320;

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLoadingBreakpoints() {
  const first = randomInteger(15, 25);
  const second = randomInteger(Math.max(first + 10, 35), 50);
  const third = randomInteger(Math.max(second + 8, 55), 70);
  const fourth = randomInteger(Math.max(third + 8, 75), 88);

  return [first, second, third, fourth, 100];
}

function easeProgress(progress: number) {
  if (progress <= 0) {
    return 0;
  }

  if (progress >= 1) {
    return 1;
  }

  if (progress < 0.2) {
    return 0.32 * Math.sin((progress / 0.2) * (Math.PI / 2));
  }

  if (progress < 0.45) {
    const localProgress = (progress - 0.2) / 0.25;
    return 0.32 + 0.16 * (1 - Math.cos(localProgress * Math.PI)) * 0.5;
  }

  if (progress < 0.75) {
    const localProgress = (progress - 0.45) / 0.3;
    return 0.48 + 0.24 * (1 - Math.cos(localProgress * Math.PI)) * 0.5;
  }

  if (progress < 0.9) {
    const localProgress = (progress - 0.75) / 0.15;
    return 0.72 + 0.08 * (1 - Math.cos(localProgress * Math.PI)) * 0.5;
  }

  const localProgress = (progress - 0.9) / 0.1;
  return 0.8 + 0.2 * Math.pow(localProgress, 0.42);
}

function getStatusOpacity(index: number, progress: number, breakpoints: number[]) {
  const overlap = 1.2;
  const segmentStart = index === 0 ? 0 : breakpoints[index - 1];
  const segmentEnd = breakpoints[index];
  const fadeInStart = Math.max(0, segmentStart - overlap / 2);
  const fadeInEnd = Math.min(segmentEnd, segmentStart + overlap / 2);
  const fadeOutStart = Math.max(segmentStart, segmentEnd - overlap / 2);
  const fadeOutEnd = Math.min(100, segmentEnd + overlap / 2);

  if (progress < fadeInStart || progress > fadeOutEnd) {
    return 0;
  }

  if (progress < fadeInEnd) {
    const normalizedProgress = (progress - fadeInStart) / Math.max(0.001, fadeInEnd - fadeInStart);
    return Math.pow(normalizedProgress, 3);
  }

  if (progress <= fadeOutStart) {
    return 1;
  }

  const normalizedProgress = (progress - fadeOutStart) / Math.max(0.001, fadeOutEnd - fadeOutStart);
  return Math.pow(1 - normalizedProgress, 3);
}

export function LocationZipHeroCard({ fallbackAreas }: LocationZipHeroCardProps) {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchBadge, setMatchBadge] = useState("");
  const [matchedArea, setMatchedArea] = useState<LocationArea | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [cardState, setCardState] = useState<ZipCardState>("input");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingProgressValue, setLoadingProgressValue] = useState(0);
  const [loadingBreakpoints, setLoadingBreakpoints] = useState<number[]>([20, 40, 60, 80, 100]);
  const [loadingIsExiting, setLoadingIsExiting] = useState(false);
  const [leadCaptureState, setLeadCaptureState] = useState<LeadCaptureState>({ status: "idle", message: "" });
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  const exampleZips = useMemo(() => fallbackAreas.flatMap((area) => area.zipCodes).filter(Boolean).slice(0, 3).join(" · "), [fallbackAreas]);

  useEffect(() => {
    if (cardState !== "loading") {
      return;
    }

    setLoadingProgress(0);
    setLoadingProgressValue(0);
    setLoadingIsExiting(false);

    const animationStart = window.performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - animationStart;
      const normalizedElapsed = Math.min(elapsed / loadingDurationMs, 1);
      const nextProgressValue = easeProgress(normalizedElapsed) * 100;
      const nextProgressInteger = Math.min(100, Math.floor(nextProgressValue));

      setLoadingProgressValue(nextProgressValue);
      setLoadingProgress(nextProgressInteger);

      if (normalizedElapsed < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      setLoadingProgressValue(100);
      setLoadingProgress(100);

      timeoutRefs.current = [
        window.setTimeout(() => {
          setLoadingIsExiting(true);
        }, loadingHoldMs),
        window.setTimeout(() => {
          setIsSubmitting(false);
          setCardState("success");
          setLoadingIsExiting(false);
        }, loadingHoldMs + loadingExitMs)
      ];
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      timeoutRefs.current.forEach((timer) => window.clearTimeout(timer));
      timeoutRefs.current = [];
    };
  }, [cardState]);

  function handleZipChange(nextValue: string) {
    setZip(normalizeZip(nextValue));
    if (error) {
      setError("");
    }
    if (message) {
      setMessage("");
    }
    if (matchBadge) {
      setMatchBadge("");
    }
    if (matchedArea) {
      setMatchedArea(null);
    }
    if (locationLabel) {
      setLocationLabel("");
    }
    if (cardState !== "input") {
      setCardState("input");
    }
    if (leadCaptureState.status !== "idle" || leadCaptureState.message) {
      setLeadCaptureState({ status: "idle", message: "" });
    }
  }

  function resetCard() {
    setError("");
    setMessage("");
    setIsSubmitting(false);
    setMatchBadge("");
    setMatchedArea(null);
    setLocationLabel("");
    setCardState("input");
    setLoadingProgress(0);
    setLoadingProgressValue(0);
    setLoadingIsExiting(false);
    setLeadCaptureState({ status: "idle", message: "" });
  }

  async function handleLeadCaptureSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadCaptureState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      zipCode: zip || "00000",
      accidentDate: String(formData.get("accidentDate") ?? "").trim(),
      injuryConcern: String(formData.get("injuryConcern") ?? "").trim(),
      preferredContactTime: "Any time today",
      pageSource: matchedArea ? `locations:${matchedArea.stateSlug}/${matchedArea.slug}:inline-card` : "locations:inline-card"
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setLeadCaptureState({
        status: "error",
        message: result?.error ?? "Please check the form and try again."
      });
      return;
    }

    router.push("/thank-you");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedZip = normalizeZip(zip);

    if (normalizedZip.length !== 5) {
      setError("Enter a valid 5-digit ZIP code.");
      setMessage("");
      setMatchBadge("");
      setMatchedArea(null);
      setLocationLabel("");
      setCardState("input");
      setLoadingProgress(0);
      setLoadingProgressValue(0);
      setLoadingIsExiting(false);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");
    setMatchBadge("");
    setMatchedArea(null);
    setLocationLabel("");
    setLoadingProgress(0);
    setLoadingProgressValue(0);
    setLoadingIsExiting(false);

    const matchedArea = getAreaForZip(normalizedZip);
    const placeholderCount = getPlaceholderZipMatchCount(normalizedZip, matchedArea ?? undefined);
    const nextLocationLabel = matchedArea ? `${matchedArea.name}, ${matchedArea.stateCode}` : "your area";

    setMatchBadge(`🟢 ${placeholderCount}+ Chiropractors available in ${nextLocationLabel}`);
    setLocationLabel(nextLocationLabel);
    setMatchedArea(matchedArea ?? null);
    setLoadingBreakpoints(createLoadingBreakpoints());
    setCardState("loading");
  }

  return (
    <aside className="locations-zip-card surface-card" aria-label="ZIP availability lookup">
      {cardState === "success" ? (
        <div className="locations-zip-card__success">
          <div className="locations-zip-card__badge">{matchBadge}</div>
          <h2 className="locations-zip-card__title">Good news.</h2>
          <p className="locations-zip-card__description locations-zip-card__description--success">
            {matchedArea
              ? `ZIP ${zip} maps to our ${locationLabel} market. We can use that to guide your match.`
              : `ZIP ${zip} is ready for a placeholder match while we finish the full location dataset.`}
          </p>
          <button type="button" className="locations-zip-card__success-button" onClick={() => setCardState("lead")}>
            → Find My Chiropractor Match
          </button>
          <button type="button" className="locations-zip-card__secondary-button" onClick={resetCard}>
            ← Try a different ZIP code
          </button>
          <div className="locations-zip-card__success-meta">
            <p>Free service · Most care covered by insurance</p>
            <p>⏱ Average response time: 47 minutes</p>
          </div>
        </div>
      ) : cardState === "lead" ? (
        <form className="locations-zip-card__lead form-compact" onSubmit={handleLeadCaptureSubmit} noValidate>
          <div className="locations-zip-card__badge">🟢 Chiropractors found near {zip}</div>
          <h2 className="locations-zip-card__title">One last step.</h2>
          <p className="locations-zip-card__description locations-zip-card__description--success">
            Tell us how to reach you and we&apos;ll connect you with the best match nearby.
          </p>

          <div className="locations-zip-card__lead-grid">
            <label className="locations-zip-card__lead-label">
              <span className="field-label">Full Name</span>
              <input className="field-input" name="name" autoComplete="name" placeholder="Jane Smith" required />
            </label>

            <label className="locations-zip-card__lead-label">
              <span className="field-label">Phone Number</span>
              <input className="field-input" name="phone" type="tel" autoComplete="tel" placeholder="(555) 000-0000" required />
            </label>

            <label className="locations-zip-card__lead-label">
              <span className="field-label">Email Address</span>
              <input className="field-input" name="email" type="email" autoComplete="email" placeholder="jane@email.com" required />
            </label>

            <label className="locations-zip-card__lead-label">
              <span className="field-label">Date of Accident</span>
              <input className="field-input" name="accidentDate" type="date" required />
            </label>

            <label className="locations-zip-card__lead-label locations-zip-card__lead-label--full">
              <span className="field-label">Injury Description</span>
              <textarea
                className="field-textarea"
                name="injuryConcern"
                rows={3}
                placeholder="e.g. Neck pain, back stiffness, headaches, numbness, whiplash..."
                required
              />
            </label>
          </div>

          {leadCaptureState.status === "error" ? (
            <p className="locations-zip-card__lead-error">{leadCaptureState.message}</p>
          ) : null}

          <button className="button-primary locations-zip-card__lead-submit" type="submit" disabled={leadCaptureState.status === "loading"}>
            {leadCaptureState.status === "loading" ? "Sending request..." : "→ Get My Free Match"}
          </button>

          <p className="locations-zip-card__lead-meta">Free service · Most care covered by insurance · Response within 1 hour</p>
        </form>
      ) : cardState === "loading" ? (
        <div className={`locations-zip-card__loading${loadingIsExiting ? " locations-zip-card__loading--exiting" : ""}`} aria-live="polite">
          <div className="locations-zip-card__loading-header">
            <p className="locations-zip-card__loading-percentage">{loadingProgress}%</p>
            <p className="locations-zip-card__loading-location">
              📍 Searching near {zip} · {locationLabel}
            </p>
          </div>
          <div className="locations-zip-card__loading-progress" aria-hidden="true">
            <div className="locations-zip-card__loading-progress-bar" style={{ width: `${loadingProgressValue}%` }} />
          </div>
          <div className="locations-zip-card__loading-status-wrap" aria-live="off">
            {loadingStatusLines.map((line, index) => (
              <p
                key={line}
                className="locations-zip-card__loading-status"
                style={{ opacity: getStatusOpacity(index, loadingProgressValue, loadingBreakpoints) }}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="locations-zip-card__loading-skeletons" aria-hidden="true">
            <span className="locations-zip-card__loading-skeleton locations-zip-card__loading-skeleton--wide" />
            <span className="locations-zip-card__loading-skeleton locations-zip-card__loading-skeleton--medium" />
            <span className="locations-zip-card__loading-skeleton locations-zip-card__loading-skeleton--narrow" />
          </div>
        </div>
      ) : (
        <>
          <div className="locations-zip-card__copy">
            <h2 className="locations-zip-card__title">Enter your ZIP code 📍</h2>
            <p className="locations-zip-card__description">We&apos;ll point you toward the closest live ChiropracticMatch city page right now.</p>
          </div>

          <form className="locations-zip-card__form" onSubmit={handleSubmit} noValidate>
            <label className="locations-zip-card__input-wrap" htmlFor="locations-zip-input">
              <span className="locations-zip-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
              </span>
              <input
                id="locations-zip-input"
                className="locations-zip-card__input"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000"
                value={zip}
                maxLength={5}
                onChange={(event) => handleZipChange(event.target.value)}
                aria-invalid={error ? "true" : "false"}
                aria-describedby="locations-zip-feedback"
              />
            </label>

            <button className="locations-zip-card__button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Checking..." : "Check"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p
            id="locations-zip-feedback"
            className={`locations-zip-card__feedback${error ? " locations-zip-card__feedback--error" : ""}${message ? " locations-zip-card__feedback--message" : ""}`}
            aria-live="polite"
          >
            {error || message || `Try a live market ZIP like ${exampleZips}.`}
          </p>
        </>
      )}
    </aside>
  );
}
