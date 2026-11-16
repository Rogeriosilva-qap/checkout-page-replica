import { z } from "zod";

export const questionLeadSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(255),
  marketingConsent: z.boolean().default(false),
  website: z.string().max(0, "Não foi possível enviar.").default(""),
});

export const questionSchema = z.object({
  question: z.string().trim().min(20, "Cole a questão completa, com enunciado e alternativas.").max(4000, "A questão ficou longa demais; envie apenas o enunciado e as alternativas."),
});