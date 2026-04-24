import { z } from "zod";

export const providerApplicationSchema = z.object({
  contactName: z.string().min(2, "Please enter your name."),
  practiceName: z.string().min(2, "Please enter your practice name."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  website: z.string().url("Please enter a valid website URL.").or(z.literal("")).optional(),
  city: z.string().min(2, "Please enter your city."),
  state: z.string().min(2, "Please enter your state."),
  licenseNumber: z.string().min(3, "Please enter your license number."),
  malpracticeStatus: z.string().min(1, "Please choose a malpractice insurance status."),
  specialties: z.string().min(8, "Please share your accident-care experience."),
  desiredLeadVolume: z.string().min(1, "Please choose a desired lead volume."),
  notes: z.string().optional(),
  pageSource: z.string().min(1)
});

export type ProviderApplicationInput = z.infer<typeof providerApplicationSchema>;

export type StoredProviderApplication = ProviderApplicationInput & {
  id: string;
  createdAt: string;
};
