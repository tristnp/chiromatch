"use client";

import { useState } from "react";

type BlogLeadFormProps = {
  pageSource: string;
};

type FormState =
  | { status: "idle"; message: string }
  | { status: "loading"; message: string }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

const initialState: FormState = {
  status: "idle",
  message: ""
};

export function BlogLeadForm({ pageSource }: BlogLeadFormProps) {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      injuryConcern: String(formData.get("injuryConcern") ?? "").trim(),
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
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setState({
        status: "error",
        message: result?.error ?? "Please check the form and try again."
      });
      return;
    }

    setState({
      status: "success",
      message: "Thanks — we got your request and will use it to help match you with the right next step."
    });
    event.currentTarget.reset();
  }

  return (
    <section id="blog-match-form" className="blog-lead-form">
      <div className="blog-lead-form__header">
        <p className="blog-lead-form__eyebrow">Free accident-care match</p>
        <h2 className="blog-lead-form__title">Tell us what hurts. We&apos;ll help with the next step.</h2>
        <p className="blog-lead-form__description">
          Share a few details and ChiropracticMatch will help point you toward the right chiropractor after the accident.
        </p>
      </div>

      {state.status === "success" ? (
        <div className="blog-lead-form__success">
          <p className="blog-lead-form__success-title">Request received</p>
          <p>{state.message}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="blog-lead-form__fields">
          <label>
            <span className="field-label">Full Name</span>
            <input className="field-input" name="name" autoComplete="name" placeholder="Jane Smith" required />
          </label>

          <label>
            <span className="field-label">Phone Number</span>
            <input className="field-input" name="phone" autoComplete="tel" placeholder="(555) 000-0000" required />
          </label>

          <label>
            <span className="field-label">Email</span>
            <input className="field-input" name="email" type="email" autoComplete="email" placeholder="jane@email.com" required />
          </label>

          <label>
            <span className="field-label">Injury Description</span>
            <textarea
              className="field-textarea"
              name="injuryConcern"
              placeholder="Neck pain, back stiffness, headaches, whiplash symptoms..."
              required
            />
          </label>

          {state.status === "error" ? (
            <p className="blog-lead-form__error">{state.message}</p>
          ) : null}

          <button className="button-primary blog-lead-form__button" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Sending..." : "→ Get My Free Match"}
          </button>

          <p className="blog-lead-form__note">Private and no-cost. We use this only to help with your next step.</p>
        </form>
      )}
    </section>
  );
}
