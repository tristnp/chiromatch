"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadFormProps = {
  pageSource: string;
  heading?: string;
  subheading?: string;
  compact?: boolean;
  showCallout?: boolean;
};

type FormState = {
  status: "idle" | "loading" | "error";
  message: string;
};

const initialState: FormState = {
  status: "idle",
  message: ""
};

export function LeadForm({
  pageSource,
  heading = "Request Your Free Match",
  subheading = "60 seconds · No cost · Confidential",
  compact = false,
  showCallout = true
}: LeadFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      zipCode: String(formData.get("zipCode") ?? "00000"),
      accidentDate: String(formData.get("accidentDate") ?? new Date().toISOString().slice(0, 10)),
      injuryConcern: String(formData.get("injuryConcern") ?? ""),
      preferredContactTime: String(formData.get("preferredContactTime") ?? "Any time today"),
      pageSource
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
      setState({
        status: "error",
        message: result?.error ?? "Please check the form and try again."
      });
      return;
    }

    router.push("/thank-you");
  }

  return (
    <form
      id="match-form"
      onSubmit={onSubmit}
      className="surface-card rounded-[8px] p-6 sm:p-7"
    >
      <div>
        <h2 className="text-[2rem] font-black leading-tight text-[#12203f]">{heading}</h2>
        <p className="mt-2 text-base font-medium text-[#7f94b1]">{subheading}</p>
      </div>

      <div className={`mt-7 grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label>
          <span className="field-label">First name</span>
          <input className="field-input" name="firstName" autoComplete="given-name" placeholder="Jane" required />
        </label>
        <label>
          <span className="field-label">Last name</span>
          <input className="field-input" name="lastName" autoComplete="family-name" placeholder="Smith" required />
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        <label>
          <span className="field-label">Phone number</span>
          <input className="field-input" name="phone" autoComplete="tel" placeholder="(555) 000-0000" required />
        </label>
        <label>
          <span className="field-label">Email address</span>
          <input className="field-input" name="email" type="email" autoComplete="email" placeholder="jane@email.com" required />
        </label>
      </div>

      <div className={`mt-4 grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label>
          <span className="field-label">Accident date</span>
          <input className="field-input" name="accidentDate" type="date" required />
        </label>
        <label>
          <span className="field-label">Preferred contact time</span>
          <select className="field-select" name="preferredContactTime" defaultValue="Any time today" required>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Any time today</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="field-label">Describe your injury</span>
        <textarea
          className="field-textarea"
          name="injuryConcern"
          placeholder="e.g. Neck pain, back stiffness, headaches, numbness, whiplash..."
          required
        />
      </label>

      <input type="hidden" name="zipCode" value="00000" />

      {state.status === "error" ? (
        <p className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}

      <button className="button-primary mt-5 w-full" type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Sending request..." : "Find My Match"}
      </button>

      {showCallout ? (
        <p className="mt-4 text-center text-sm font-medium leading-6 text-[#91a2ba]">
          Your information is private and never sold.
        </p>
      ) : null}
    </form>
  );
}
