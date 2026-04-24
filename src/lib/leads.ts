import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  zipCode: z.string().min(5, "Please enter your ZIP code.").max(10),
  accidentDate: z.string().min(1, "Please choose the accident date."),
  injuryConcern: z.string().min(8, "Please share a little about what you are feeling."),
  preferredContactTime: z.string().min(1, "Please choose a preferred contact time."),
  pageSource: z.string().min(1)
});

export type LeadInput = z.infer<typeof leadSchema>;

export type StoredLead = LeadInput & {
  id: string;
  createdAt: string;
};
