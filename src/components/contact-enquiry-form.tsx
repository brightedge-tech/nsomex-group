"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { supabase } from "@/lib/supabase";

export function ContactEnquiryForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.contact;
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    // Quietly discard automated submissions that fill the hidden honeypot field.
    if (String(data.get("website") ?? "").trim()) {
      setStatus("success");
      form.reset();
      return;
    }

    if (!supabase) {
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    try {
      const { error } = await supabase.from("contact_enquiries").insert({
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        organization: String(data.get("organization") ?? "").trim() || null,
        country: String(data.get("country") ?? "").trim() || null,
        enquiry_type: String(data.get("enquiry_type") ?? "general"),
        message: String(data.get("message") ?? "").trim(),
        locale,
      });

      if (error) {
        setStatus("error");
        return;
      }

      formRef.current?.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="contact-form-section" aria-labelledby="contact-form-title">
      <div className="contact-form-heading">
        <p className="eyebrow dark-eyebrow">{t.formEyebrow}</p>
        <h2 id="contact-form-title">{t.formTitle}</h2>
        <p>{t.formDescription}</p>
      </div>

      <form ref={formRef} className="contact-enquiry-form" onSubmit={handleSubmit}>
        <div className="contact-form-grid">
          <label className="contact-field">
            <span>{t.nameLabel} <span aria-hidden="true">*</span></span>
            <input name="name" type="text" autoComplete="name" minLength={2} maxLength={120} required />
          </label>
          <label className="contact-field">
            <span>{t.emailLabelForm} <span aria-hidden="true">*</span></span>
            <input name="email" type="email" autoComplete="email" maxLength={254} required />
          </label>
          <label className="contact-field">
            <span>{t.organizationLabel}</span>
            <input name="organization" type="text" autoComplete="organization" maxLength={160} />
          </label>
          <label className="contact-field">
            <span>{t.countryLabel}</span>
            <input name="country" type="text" autoComplete="country-name" maxLength={100} />
          </label>
          <label className="contact-field contact-field-full">
            <span>{t.typeLabel}</span>
            <select name="enquiry_type" defaultValue="general">
              <option value="general">{t.typeGeneral}</option>
              <option value="partnership">{t.typePartnership}</option>
              <option value="project">{t.typeProject}</option>
              <option value="supplier">{t.typeSupplier}</option>
              <option value="other">{t.typeOther}</option>
            </select>
          </label>
          <label className="contact-field contact-field-full">
            <span>{t.messageLabel} <span aria-hidden="true">*</span></span>
            <textarea name="message" rows={6} minLength={10} maxLength={5000} required />
          </label>
        </div>

        <div className="contact-honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="contact-form-actions">
          <p>{t.requiredNote}</p>
          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? t.submittingLabel : t.submitLabel}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className={`contact-form-status contact-form-status-${status}`} role="status" aria-live="polite">
          {status === "success" ? t.successMessage : status === "error" ? t.errorMessage : ""}
        </p>
      </form>
    </section>
  );
}
