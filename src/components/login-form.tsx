'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {IconBrandGoogleFilled} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {useRouter, useSearchParams} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import z from 'zod';
import {signIn} from '@/actions/sign-in';
import {createClient} from '@/lib/supabase/client';
import {Button} from './ui/button';
import {Form, FormField, FormItem, FormLabel, FormMessage} from './ui/form';
import {Input} from './ui/input';

const formSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const client = createClient();
  const {mutate, isPending} = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (data: FormData) => {
      const {business, error} = await signIn(data);

      if (error || !business) {
        throw error;
      }

      return business;
    },
    onSuccess: data => {
      const next = params.get('next');

      if (next) {
        return router.push(next);
      }

      return router.push(`${data.url}/dashboard`);
    },
    onError: e => toast.error(e.message),
  });

  const onSubmit = async (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* OAuth buttons */}
      <Button variant="secondary" className="h-11" type="button">
        <IconBrandGoogleFilled className="size-5" />
        Entrar com Google
      </Button>

      {/* Separator */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-sm">ou</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      {/* Email form */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-right font-medium text-foreground">
                    E-mail
                  </FormLabel>
                  <Input placeholder="nome@email.com" {...field} />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-right font-medium text-foreground">
                    Palavra-passe
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Sua palavra-passe"
                    {...field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isPending} type="submit" className="h-11">
              Entrar
            </Button>
          </div>
        </Form>
      </form>
    </div>
  );
}
