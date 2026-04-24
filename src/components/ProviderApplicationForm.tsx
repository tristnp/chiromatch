"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  status: "idle" | "loading" | "error";
  message: string;
};

const initialState: FormState = {
  status: "idle",
  message: ""
};

export function ProviderApplicationForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const payload = {
      contactName: String(formData.get("contactName") ?? "").trim(),
      practiceName: String(formData.get("practiceName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      licenseNumber: String(formData.get("licenseNumber") ?? "").trim(),
      malpracticeStatus: String(formData.get("malpracticeStatus") ?? "").trim(),
      specialties: String(formData.get("specialties") ?? "").trim(),
      desiredLeadVolume: String(formData.get("desiredLeadVolume") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
      pageSource: "for-chiropractors"
    };

    const response = await fetch("/api/providers", {
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
        message: result?.error ?? "Please check the application and try again."
      });
      return;
    }

    router.push("/provider-thank-you");
  }

  return (
    <form id="provider-application" onSubmit={onSubmit} className="form-compact surface-card motion-fade-up motion-delay-2 rounded-[8px] p-5 sm:p-6">
      <div>
        <p className="section-eyebrow">Provider application</p>
        <h2 className="mt-2 text-[1.7rem] font-black leading-tight text-[#12203f] sm:text-[1.9rem]">Apply to join the network</h2>
        <p className="mt-2 text-[0.98rem] font-medium leading-7 text-[#7f94b1]">
          Tell us where you practice and how you support auto accident patients. Our team reviews applications before activating any market.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="field-label">Contact name</span>
          <input className="field-input" name="contactName" autoComplete="name" placeholder="Dr. Jane Smith" required />
        </label>
        <label>
          <span className="field-label">Practice name</span>
          <input className="field-input" name="practiceName" autoComplete="organization" placeholder="Smith Chiropractic" required />
        </label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="field-label">Phone number</span>
          <input className="field-input" name="phone" autoComplete="tel" placeholder="(555) 000-0000" required />
        </label>
        <label>
          <span className="field-label">Email address</span>
          <input className="field-input" name="email" type="email" autoComplete="email" placeholder="doctor@practice.com" required />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="field-label">Website</span>
        <input className="field-input" name="website" type="url" placeholder="https://yourpractice.com" />
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="field-label">City</span>
          <input className="field-input" name="city" autoComplete="address-level2" placeholder="Sacramento" required />
        </label>
        <label>
          <span className="field-label">State</span>
          <input className="field-input" name="state" autoComplete="address-level1" placeholder="CA" required />
        </label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="field-label">License number</span>
          <input className="field-input" name="licenseNumber" placeholder="License #" required />
        </label>
        <label>
          <span className="field-label">Malpractice insurance</span>
          <select className="field-select" name="malpracticeStatus" defaultValue="" required>
            <option value="" disabled>
              Select status
            </option>
            <option>Active coverage</option>
            <option>Pending renewal</option>
            <option>Need to discuss</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="field-label">Accident-care experience</span>
        <textarea
          className="field-textarea"
          name="specialties"
          placeholder="e.g. whiplash, PI documentation, liens, PIP, attorney referrals, imaging coordination..."
          required
        />
      </label>

      <label className="mt-3 block">
        <span className="field-label">Desired lead volume</span>
        <select className="field-select" name="desiredLeadVolume" defaultValue="" required>
          <option value="" disabled>
            Select monthly volume
          </option>
          <option>Up to 10 leads/month</option>
          <option>10-30 leads/month</option>
          <option>30+ leads/month</option>
          <option>Not sure yet</option>
        </select>
      </label>

      <label className="mt-3 block">
        <span className="field-label">Anything else we should know?</span>
        <textarea className="field-textarea" name="notes" placeholder="Service area, office hours, case types, or onboarding questions..." />
      </label>

      {state.status === "error" ? (
        <p className="mt-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}

      <button className="button-primary mt-4 w-full" type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Submitting application..." : "Apply to Join Our Network"}
      </button>

      <p className="mt-3 text-center text-sm font-medium leading-6 text-[#91a2ba]">
        Applications are reviewed before any patient inquiries are routed.
      </p>
    </form>
  );
}
