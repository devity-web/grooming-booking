import z from 'zod';

export const signInFormSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória'),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
