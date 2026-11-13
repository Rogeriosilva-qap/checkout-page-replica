import { z } from "zod";

const website = z.string().max(0, "Não foi possível enviar.").default("");
export const commentSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100, "Use até 100 caracteres no nome."),
  message: z.string().trim().min(1, "Escreva seu depoimento.").max(2000, "Use até 2.000 caracteres."),
  rating: z.coerce.number().int().min(1, "Escolha de 1 a 5 estrelas.").max(5, "Escolha de 1 a 5 estrelas."),
  website,
});
export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(255),
  consent: z.literal(true, { errorMap: () => ({ message: "Autorize o recebimento de novidades para continuar." }) }),
  website,
});