 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CityLeadForm({ pageSource }) {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      injuryConcern: String(formData.get("injuryConcern") ?? ""),
      zipCode: "00000",
      accidentDate: new Date().toISOString().slice(0, 10),
      preferredContactTime: "Any time today",
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
      const result = await response.json().catch(() => null);
      setStatus("error");
      setMessage(result?.error ?? "Please check the form and try again.");
      return;
    }

    router.push("/thank-you");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[8px] border border-[#dce8df] bg-white p-5 shadow-soft sm:p-6">
      <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-clay">Free consultation request</p>
      <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Tell us about your injury</h2>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        Share your details and ChiropracticMatch will help you take the next step after the crash.
      </p>

      <div className="mt-5 grid gap-4">
        <label>
          <span className="field-label">Name</span>
          <input className="field-input" name="name" autoComplete="name" required />
        </label>
        <label>
          <span className="field-label">Phone</span>
          <input className="field-input" name="phone" autoComplete="tel" required />
        </label>
        <label>
          <span className="field-label">Email</span>
          <input className="field-input" name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span className="field-label">Injury description</span>
          <textarea
            className="field-textarea"
            name="injuryConcern"
            placeholder="Neck pain, whiplash symptoms, back stiffness, headaches, shoulder pain..."
            required
          />
        </label>
      </div>

      {status === "error" ? (
        <p className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {message}
        </p>
      ) : null}

      <button className="button-primary mt-5 w-full" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Submit my request"}
      </button>
    </form>
  );
}
