"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  businessTypeLabels,
  businessTypes,
  leadFormSchema,
  type LeadFormValues,
} from "@shared/leads-schema";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 14px",
  background: "var(--input-bg)",
  border: "1px solid var(--line)",
  borderRadius: 4,
  color: "var(--fg)",
  fontFamily: "var(--mono)",
  fontSize: 14,
  letterSpacing: "0.04em",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: 120,
  padding: "12px 14px",
  resize: "vertical" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--mono)",
  fontSize: 12.5,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--fg-dim)",
  marginBottom: 8,
  fontWeight: 500,
};

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 12,
  color: "var(--red)",
  marginTop: 6,
  letterSpacing: "0.04em",
};

export function CotizarForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { city: "Medellín" },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setSubmitError(data.error ?? "No pudimos enviar el formulario.");
      return;
    }
    router.push("/cotizar/gracias");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "grid", gap: 22, marginTop: 40 }}
      noValidate
    >
      <div>
        <label style={labelStyle} htmlFor="name">
          Nombre *
        </label>
        <input id="name" style={inputStyle} {...register("name")} />
        {errors.name && <div style={errorStyle}>{errors.name.message}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="email">
            Email *
          </label>
          <input id="email" type="email" style={inputStyle} {...register("email")} />
          {errors.email && <div style={errorStyle}>{errors.email.message}</div>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="phone">
            Teléfono
          </label>
          <input id="phone" style={inputStyle} {...register("phone")} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="businessType">
            Tipo de negocio *
          </label>
          <select id="businessType" style={inputStyle} {...register("businessType")}>
            <option value="">Selecciona…</option>
            {businessTypes.map((b) => (
              <option key={b} value={b}>
                {businessTypeLabels[b]}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <div style={errorStyle}>{errors.businessType.message}</div>
          )}
        </div>
        <div>
          <label style={labelStyle} htmlFor="estimatedLoadKw">
            Carga estimada (kW)
          </label>
          <input
            id="estimatedLoadKw"
            type="number"
            step="0.1"
            style={inputStyle}
            {...register("estimatedLoadKw")}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="city">
          Ciudad *
        </label>
        <input id="city" style={inputStyle} {...register("city")} />
        {errors.city && <div style={errorStyle}>{errors.city.message}</div>}
      </div>

      <div>
        <label style={labelStyle} htmlFor="message">
          ¿Qué te gustaría saber?
        </label>
        <textarea id="message" style={textareaStyle} {...register("message")} />
      </div>

      {submitError && (
        <div
          style={{
            ...errorStyle,
            border: "1px solid rgba(239,68,68,0.4)",
            padding: "10px 12px",
            borderRadius: 4,
            background: "rgba(239,68,68,0.06)",
          }}
        >
          {submitError}
        </div>
      )}

      <button
        type="submit"
        className="btn"
        disabled={isSubmitting}
        style={{ justifySelf: "start", opacity: isSubmitting ? 0.6 : 1 }}
      >
        {isSubmitting ? "Enviando…" : "Solicitar cotización"}
      </button>
    </form>
  );
}
