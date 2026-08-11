import z from 'zod';

export const signUpFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória'),
  company: z.string().min(1, 'Escolha um nome para o teu negócio'),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
