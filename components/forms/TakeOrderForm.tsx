"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, MapPin, Calendar, IndianRupee, Settings,
  ShoppingBag, Share2, CheckCircle2, ChevronRight,
  ChevronLeft, Loader2, AlertCircle,
} from "lucide-react";
import { orderSchema, STEP_FIELDS, OrderFormData } from "@/lib/validations/orderSchema";
import { submitOrder } from "@/actions/submitOrder";
import { generateOrderNo } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basic Info",    icon: User,         desc: "Order & customer details" },
  { id: 2, label: "Location",      icon: MapPin,       desc: "Delivery location" },
  { id: 3, label: "Event",         icon: Calendar,     desc: "Type of occasion" },
  { id: 4, label: "Budget",        icon: IndianRupee,  desc: "Budget & quantity range" },
  { id: 5, label: "Extras",        icon: Settings,     desc: "Buffer & customisation" },
  { id: 6, label: "Payment",       icon: ShoppingBag,  desc: "Category & payment" },
  { id: 7, label: "Source",        icon: Share2,       desc: "How they found us" },
];

const INITIAL: OrderFormData = {
  order_no: generateOrderNo(),
  event_date: "", customer_name: "", phone_number: "",
  city: "", address: "",
  event_type: "Birthday",
  budget_min: 0, budget_max: 0,
  quantity_min: 1, quantity_max: 1,
  buffer: false, buffer_quantity: null,
  customization: false,
  item_category: "Lifestyle",
  payment_mode: "Cash",
  advance_payment: 0,
  source: "Social Media",
};

/* ── Shared tiny components ───────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
      style={{ color: "var(--aira-gold)", letterSpacing: "0.06em" }}>
      {children}
    </label>
  );
}

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs mt-1.5" style={{ color: "#e53e3e" }}>
      <AlertCircle size={11} />{msg}
    </p>
  );
}

/* ── FIXED: Currency input with no symbol overlap ── */
function RupeeInput({
  label, value, onChange, error, min = 0,
}: {
  label: string; value: number; onChange: (v: number) => void; error?: string; min?: number;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative flex items-center">
        {/* Symbol badge — sits outside the input box */}
        <span
          className="absolute left-0 flex items-center justify-center h-full px-3 text-sm font-semibold pointer-events-none select-none z-10"
          style={{
            color: "var(--aira-gold)",
            background: "hsl(var(--muted))",
            borderRight: "1.5px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px) 0 0 calc(var(--radius) - 2px)",
            height: "48px",
            top: 0,
          }}>
          ₹
        </span>
        <input
          type="number"
          min={min}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className={`input-premium w-full ${error ? "error" : ""}`}
          style={{ paddingLeft: "52px" }}
        />
      </div>
      <ErrMsg msg={error} />
    </div>
  );
}

function QtyInput({
  label, value, onChange, error,
}: {
  label: string; value: number; onChange: (v: number) => void; error?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative flex items-center">
        <span
          className="absolute left-0 flex items-center justify-center h-full px-3 text-xs font-bold pointer-events-none select-none z-10"
          style={{
            color: "var(--aira-gold)",
            background: "hsl(var(--muted))",
            borderRight: "1.5px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px) 0 0 calc(var(--radius) - 2px)",
            height: "48px",
            top: 0,
          }}>
          #
        </span>
        <input
          type="number"
          min={1}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="1"
          className={`input-premium w-full ${error ? "error" : ""}`}
          style={{ paddingLeft: "44px" }}
        />
      </div>
      <ErrMsg msg={error} />
    </div>
  );
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200"
      style={{
        background: checked ? "rgba(139,115,85,0.06)" : "hsl(var(--muted))",
        borderColor: checked ? "rgba(139,115,85,0.4)" : "hsl(var(--border))",
      }}
      onClick={() => onChange(!checked)}>
      <div>
        <div className="text-sm font-medium" style={{ color: "var(--aira-dark)" }}>{label}</div>
        {description && <div className="text-xs mt-0.5" style={{ color: "var(--aira-text)", opacity: 0.55 }}>{description}</div>}
      </div>
      <div className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ml-4"
        style={{ background: checked ? "var(--aira-gold)" : "hsl(var(--border))" }}>
        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
          style={{ left: checked ? "calc(100% - 22px)" : "2px" }} />
      </div>
    </div>
  );
}

function PillGroup({ label, options, value, onChange, error }: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
            style={{
              background: value === opt ? "var(--aira-gold)" : "hsl(var(--muted))",
              borderColor: value === opt ? "var(--aira-gold)" : "hsl(var(--border))",
              color: value === opt ? "#fff" : "var(--aira-text)",
            }}>
            {opt}
          </button>
        ))}
      </div>
      <ErrMsg msg={error} />
    </div>
  );
}

/* ── Main form ─────────────────────────────────── */
export default function TakeOrderForm() {
  const [step,        setStep]        = useState(1);
  const [form,        setForm]        = useState<OrderFormData>(INITIAL);
  const [errors,      setErrors]      = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [direction,   setDirection]   = useState(1);

  const set = useCallback(<K extends keyof OrderFormData>(k: K, v: OrderFormData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }, []);

  function validateStep(s: number): boolean {
    const fields = STEP_FIELDS[s as keyof typeof STEP_FIELDS];
    const result = orderSchema.safeParse({ ...INITIAL, ...form });

    const stepErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!result.success) {
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof OrderFormData;
        if (fields.includes(field)) stepErrors[field] = e.message;
      });
    }

    // Manual checks for empty numerics
    if (s === 4) {
      if (!form.budget_min || form.budget_min <= 0) stepErrors.budget_min = "Enter min budget";
      if (!form.budget_max || form.budget_max <= 0) stepErrors.budget_max = "Enter max budget";
      if (form.budget_max > 0 && form.budget_min > 0 && form.budget_max < form.budget_min)
        stepErrors.budget_max = "Max must be ≥ Min";
      if (!form.quantity_min || form.quantity_min <= 0) stepErrors.quantity_min = "Enter min qty";
      if (!form.quantity_max || form.quantity_max <= 0) stepErrors.quantity_max = "Enter max qty";
      if (form.quantity_max > 0 && form.quantity_min > 0 && form.quantity_max < form.quantity_min)
        stepErrors.quantity_max = "Max must be ≥ Min";
    }

    if (s === 1) {
      if (!form.customer_name) stepErrors.customer_name = "Name is required";
      if (!form.event_date)    stepErrors.event_date    = "Event date is required";
      if (!form.phone_number || !/^[6-9]\d{9}$/.test(form.phone_number))
        stepErrors.phone_number = "Enter valid 10-digit number";
    }
    if (s === 2) {
      if (!form.city)    stepErrors.city    = "City is required";
      if (!form.address || form.address.length < 10) stepErrors.address = "Enter full address";
    }
    if (s === 5 && form.buffer && (!form.buffer_quantity || form.buffer_quantity < 1)) {
      stepErrors.buffer_quantity = "Enter buffer quantity";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }

  function next() { if (!validateStep(step)) return; setDirection(1); setStep((s) => Math.min(s + 1, 7)); }
  function back() { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); }

  async function handleSubmit() {
    if (!validateStep(7)) return;
    setSubmitting(true); setSubmitError("");
    const result = await submitOrder(form);
    setSubmitting(false);
    if (result.success) setSubmitted(true);
    else setSubmitError(result.error);
  }

  // Success
  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(61,122,94,0.1)" }}>
          <CheckCircle2 size={40} style={{ color: "#3d7a5e" }} />
        </div>
        <h2 className="font-display text-3xl font-semibold mb-2" style={{ color: "var(--aira-dark)" }}>Order Placed!</h2>
        <p className="text-sm mb-2" style={{ color: "var(--aira-text)", opacity: 0.65 }}>
          Order <span className="font-semibold" style={{ color: "var(--aira-gold)" }}>{form.order_no}</span> submitted successfully.
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--aira-text)", opacity: 0.5 }}>The team will review and process this order shortly.</p>
        <button onClick={() => { setForm({ ...INITIAL, order_no: generateOrderNo() }); setStep(1); setSubmitted(false); }}
          className="px-8 py-3 rounded-full font-medium text-white hover:scale-105 transition-all"
          style={{ background: "var(--aira-gold)" }}>
          Take Another Order
        </button>
      </motion.div>
    );
  }

  const currentStep = STEPS[step - 1];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--aira-dark)" }}>Take New Order</h1>
        <p className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.55 }}>Complete all 7 steps to submit the order.</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold" style={{ color: "var(--aira-gold)" }}>Step {step} of {STEPS.length}</span>
          <span className="text-xs" style={{ color: "var(--aira-text)", opacity: 0.45 }}>{Math.round((step / STEPS.length) * 100)}% complete</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--aira-gold), var(--aira-gold-light))" }}
            animate={{ width: `${(step / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
        <div className="flex items-center justify-between mt-3">
          {STEPS.map((s) => (
            <button key={s.id} type="button"
              onClick={() => { if (s.id < step) { setDirection(-1); setStep(s.id); } }}
              disabled={s.id > step} className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200"
                style={{
                  background: s.id < step ? "var(--aira-gold)" : s.id === step ? "var(--aira-dark)" : "hsl(var(--muted))",
                  color: s.id <= step ? "#fff" : "hsl(var(--muted-foreground))",
                  border: s.id === step ? "2px solid var(--aira-gold)" : "none",
                }}>
                {s.id < step ? "✓" : s.id}
              </div>
              <span className="hidden sm:block text-[10px] font-medium"
                style={{ color: s.id === step ? "var(--aira-gold)" : s.id < step ? "var(--aira-gold-muted)" : "hsl(var(--muted-foreground))" }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "#fff", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 24px rgba(139,115,85,0.08)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--aira-gold-pale)" }}>
            <currentStep.icon size={17} style={{ color: "var(--aira-gold)" }} />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--aira-dark)" }}>{currentStep.label}</div>
            <div className="text-xs" style={{ color: "var(--aira-text)", opacity: 0.5 }}>{currentStep.desc}</div>
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div key={step} custom={direction}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.25, ease: "easeOut" }}>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <FieldLabel>Order No</FieldLabel>
                    <input readOnly value={form.order_no}
                      className="input-premium font-mono text-sm cursor-not-allowed"
                      style={{ color: "var(--aira-gold)", borderColor: "rgba(139,115,85,0.2)", background: "var(--aira-gold-pale)" }} />
                    <p className="text-xs mt-1" style={{ color: "var(--aira-text)", opacity: 0.4 }}>Auto-generated</p>
                  </div>
                  <div>
                    <FieldLabel>Event Date *</FieldLabel>
                    <input type="date" className={`input-premium ${errors.event_date ? "error" : ""}`}
                      value={form.event_date} min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => set("event_date", e.target.value)} />
                    <ErrMsg msg={errors.event_date} />
                  </div>
                  <div>
                    <FieldLabel>Customer Name *</FieldLabel>
                    <input type="text" className={`input-premium ${errors.customer_name ? "error" : ""}`}
                      placeholder="Full name" value={form.customer_name}
                      onChange={(e) => set("customer_name", e.target.value)} />
                    <ErrMsg msg={errors.customer_name} />
                  </div>
                  <div>
                    <FieldLabel>Phone Number *</FieldLabel>
                    <input type="tel" className={`input-premium ${errors.phone_number ? "error" : ""}`}
                      placeholder="10-digit mobile number" maxLength={10} value={form.phone_number}
                      onChange={(e) => set("phone_number", e.target.value.replace(/\D/g, ""))} />
                    <ErrMsg msg={errors.phone_number} />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <FieldLabel>City *</FieldLabel>
                    <input type="text" className={`input-premium ${errors.city ? "error" : ""}`}
                      placeholder="e.g. Hyderabad" value={form.city}
                      onChange={(e) => set("city", e.target.value)} />
                    <ErrMsg msg={errors.city} />
                  </div>
                  <div>
                    <FieldLabel>Full Address *</FieldLabel>
                    <textarea className={`input-premium ${errors.address ? "error" : ""}`}
                      placeholder="House/flat no, street, area, landmark..."
                      value={form.address} rows={3}
                      onChange={(e) => set("address", e.target.value)} />
                    <ErrMsg msg={errors.address} />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <PillGroup label="Event Type *"
                  options={["Birthday", "Marriage", "Housewarming", "Others"]}
                  value={form.event_type}
                  onChange={(v) => set("event_type", v as OrderFormData["event_type"])}
                  error={errors.event_type} />
              )}

              {/* STEP 4 – Fixed rupee overlap */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <RupeeInput label="Budget Min *" value={form.budget_min}
                      onChange={(v) => set("budget_min", v)} error={errors.budget_min} />
                    <RupeeInput label="Budget Max *" value={form.budget_max}
                      onChange={(v) => set("budget_max", v)} error={errors.budget_max} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <QtyInput label="Qty Min *" value={form.quantity_min}
                      onChange={(v) => set("quantity_min", v)} error={errors.quantity_min} />
                    <QtyInput label="Qty Max *" value={form.quantity_max}
                      onChange={(v) => set("quantity_max", v)} error={errors.quantity_max} />
                  </div>
                  {form.budget_min > 0 && form.budget_max >= form.budget_min && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: "var(--aira-gold-pale)", color: "var(--aira-gold)" }}>
                      Budget: ₹{form.budget_min.toLocaleString("en-IN")} – ₹{form.budget_max.toLocaleString("en-IN")} &nbsp;|&nbsp; Qty: {form.quantity_min}–{form.quantity_max} units
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-4">
                  <Toggle label="Buffer Required?" description="Add extra units beyond requested quantity"
                    checked={form.buffer} onChange={(v) => set("buffer", v)} />
                  <AnimatePresence>
                    {form.buffer && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                        <QtyInput label="Buffer Quantity *" value={form.buffer_quantity ?? 0}
                          onChange={(v) => set("buffer_quantity", v || null)}
                          error={errors.buffer_quantity} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Toggle label="Customization Required?" description="Special packaging, branding or personalised notes"
                    checked={form.customization} onChange={(v) => set("customization", v)} />
                </div>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <div className="space-y-5">
                  <div>
                    <FieldLabel>Item Category *</FieldLabel>
                    <select className={`input-premium ${errors.item_category ? "error" : ""}`}
                      value={form.item_category}
                      onChange={(e) => set("item_category", e.target.value as OrderFormData["item_category"])}>
                      {["Lifestyle","Eatable","Accessories","Artifact","Toy","Combo","Others"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ErrMsg msg={errors.item_category} />
                  </div>
                  <div>
                    <FieldLabel>Payment Mode *</FieldLabel>
                    <select className={`input-premium ${errors.payment_mode ? "error" : ""}`}
                      value={form.payment_mode}
                      onChange={(e) => set("payment_mode", e.target.value as OrderFormData["payment_mode"])}>
                      {["Cash","UPI","Bank Transfer","Card","Cheque"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ErrMsg msg={errors.payment_mode} />
                  </div>
                  <RupeeInput label="Advance Payment" value={form.advance_payment}
                    onChange={(v) => set("advance_payment", v)} error={errors.advance_payment} />
                </div>
              )}

              {/* STEP 7 */}
              {step === 7 && (
                <div className="space-y-5">
                  <PillGroup label="How did they know about AIRA? *"
                    options={["Social Media", "Website", "Friends", "Referral"]}
                    value={form.source}
                    onChange={(v) => set("source", v as OrderFormData["source"])}
                    error={errors.source} />
                  {/* Summary */}
                  <div className="rounded-xl p-4 space-y-2 text-sm"
                    style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                    <div className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "var(--aira-gold)" }}>Order Summary</div>
                    {[
                      ["Order No",  form.order_no],
                      ["Customer",  form.customer_name],
                      ["Phone",     form.phone_number],
                      ["Event",     `${form.event_type} on ${form.event_date}`],
                      ["City",      form.city],
                      ["Budget",    `₹${(form.budget_min||0).toLocaleString("en-IN")} – ₹${(form.budget_max||0).toLocaleString("en-IN")}`],
                      ["Quantity",  `${form.quantity_min} – ${form.quantity_max} units`],
                      ["Category",  form.item_category],
                      ["Payment",   `${form.payment_mode} | Advance ₹${(form.advance_payment||0).toLocaleString("en-IN")}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span style={{ color: "var(--aira-text)", opacity: 0.5 }}>{k}</span>
                        <span className="font-medium text-right" style={{ color: "var(--aira-dark)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {submitError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
                      style={{ background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2" }}>
                      <AlertCircle size={14} />{submitError}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between px-6 py-4 border-t"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
          <button type="button" onClick={back} disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "hsl(var(--border))", color: "var(--aira-text)" }}>
            <ChevronLeft size={15} /> Back
          </button>
          {step < 7 ? (
            <button type="button" onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
              style={{ background: "var(--aira-gold)" }}>
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, var(--aira-gold) 0%, var(--aira-gold-light) 100%)", boxShadow: "0 4px 16px rgba(139,115,85,0.3)" }}>
              {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : <><CheckCircle2 size={15} /> Submit Order</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
