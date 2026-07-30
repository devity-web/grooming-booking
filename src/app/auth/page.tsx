'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import z from 'zod';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {createClient} from '@/lib/supabase/client';
import {cn} from '@/lib/utils';

const formSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
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
      const {error} = await client.auth.signInWithPassword(data);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => router.push('/dashboard'),
    onError: e => toast.error(e.message),
  });

  const onSubmit = async (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6')}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className="text-right font-medium text-foreground">
                          E-mail
                        </FormLabel>
                        <Input placeholder="O teu nome aqui" {...field} />

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
                        <Input type="password" {...field} />

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button isLoading={isPending} type="submit">
                    Login
                  </Button>
                </Form>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
