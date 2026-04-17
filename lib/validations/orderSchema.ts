import { z } from "zod";

export const orderSchema = z
  .object({
    // Step 1 – Basic Info
    order_no: z.string().min(1),
    event_date: z.string().min(1, "Event date is required"),
    customer_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100),
    phone_number: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

    // Step 2 – Location
    city: z.string().min(2, "City is required"),
    address: z.string().min(10, "Please enter a full address"),

    // Step 3 – Event Details
    event_type: z.enum(["Birthday", "Marriage", "Housewarming", "Others"], {
      errorMap: () => ({ message: "Please select an event type" }),
    }),

    // Step 4 – Budget & Quantity
    budget_min: z
      .number({ invalid_type_error: "Enter a valid amount" })
      .min(100, "Minimum budget is ₹100"),
    budget_max: z
      .number({ invalid_type_error: "Enter a valid amount" })
      .min(100, "Maximum budget is ₹100"),
    quantity_min: z
      .number({ invalid_type_error: "Enter a valid quantity" })
      .int()
      .min(1, "Minimum quantity is 1"),
    quantity_max: z
      .number({ invalid_type_error: "Enter a valid quantity" })
      .int()
      .min(1, "Maximum quantity is 1"),

    // Step 5 – Buffer & Customization
    buffer: z.boolean(),
    buffer_quantity: z.number().int().min(1).optional().nullable(),
    customization: z.boolean(),

    // Step 6 – Category & Payment
    item_category: z.enum(
      ["Lifestyle", "Eatable", "Accessories", "Artifact", "Toy", "Combo", "Others"],
      { errorMap: () => ({ message: "Please select a category" }) }
    ),
    payment_mode: z.enum(["Cash", "UPI", "Bank Transfer", "Card", "Cheque"], {
      errorMap: () => ({ message: "Please select a payment mode" }),
    }),
    advance_payment: z
      .number({ invalid_type_error: "Enter a valid amount" })
      .min(0, "Advance cannot be negative"),

    // Step 7 – Source
    source: z.enum(["Social Media", "Website", "Friends", "Referral"], {
      errorMap: () => ({ message: "Please select a source" }),
    }),
  })
  .refine((d) => d.budget_max >= d.budget_min, {
    message: "Max budget must be ≥ Min budget",
    path: ["budget_max"],
  })
  .refine((d) => d.quantity_max >= d.quantity_min, {
    message: "Max quantity must be ≥ Min quantity",
    path: ["quantity_max"],
  })
  .refine((d) => !d.buffer || (d.buffer_quantity != null && d.buffer_quantity > 0), {
    message: "Buffer quantity is required when buffer is enabled",
    path: ["buffer_quantity"],
  });

export type OrderFormData = z.infer<typeof orderSchema>;

export type StepFields = {
  1: (keyof OrderFormData)[];
  2: (keyof OrderFormData)[];
  3: (keyof OrderFormData)[];
  4: (keyof OrderFormData)[];
  5: (keyof OrderFormData)[];
  6: (keyof OrderFormData)[];
  7: (keyof OrderFormData)[];
};

export const STEP_FIELDS: StepFields = {
  1: ["event_date", "customer_name", "phone_number"],
  2: ["city", "address"],
  3: ["event_type"],
  4: ["budget_min", "budget_max", "quantity_min", "quantity_max"],
  5: ["buffer", "buffer_quantity", "customization"],
  6: ["item_category", "payment_mode", "advance_payment"],
  7: ["source"],
};
