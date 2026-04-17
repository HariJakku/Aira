"use server";

import { createClient } from "@/lib/supabase/server";
import { orderSchema, OrderFormData } from "@/lib/validations/orderSchema";

export type ActionResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function submitOrder(data: OrderFormData): Promise<ActionResult> {
  try {
    // Validate with Zod
    const parsed = orderSchema.safeParse(data);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Validation failed";
      return { success: false, error: msg };
    }

    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from("orders")
      .insert([
        {
          order_no: parsed.data.order_no,
          event_date: parsed.data.event_date,
          customer_name: parsed.data.customer_name,
          phone_number: parsed.data.phone_number,
          city: parsed.data.city,
          address: parsed.data.address,
          event_type: parsed.data.event_type,
          budget_min: parsed.data.budget_min,
          budget_max: parsed.data.budget_max,
          quantity_min: parsed.data.quantity_min,
          quantity_max: parsed.data.quantity_max,
          buffer: parsed.data.buffer,
          buffer_quantity: parsed.data.buffer_quantity ?? null,
          customization: parsed.data.customization,
          item_category: parsed.data.item_category,
          payment_mode: parsed.data.payment_mode,
          advance_payment: parsed.data.advance_payment,
          source: parsed.data.source,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: "Failed to save order. Please try again." };
    }

    return { success: true, orderId: inserted.id };
  } catch (err) {
    console.error("submitOrder error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
