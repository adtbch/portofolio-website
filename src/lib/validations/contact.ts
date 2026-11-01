import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Email tidak valid").max(150),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
  // honeypot: must stay empty
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
