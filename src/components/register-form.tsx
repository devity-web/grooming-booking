'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {IconBrandGoogleFilled} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {signUp} from '@/actions/sign-up';
import {
  type SignUpFormData,
  signUpFormSchema,
} from '@/lib/schemas/sign-up.schema';
import {Button} from './ui/button';
import {Form, FormField, FormItem, FormLabel, FormMessage} from './ui/form';
import {Input} from './ui/input';

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      company: '',
    },
  });

  const {mutate, isPending} = useMutation({
    mutationKey: ['auth', 'signUp'],
    mutationFn: async (data: SignUpFormData) => {
      const response = await signUp(data);

      return response;
    },
    onSuccess: () => {
      router.push('/auth');
    },
    onError: e => toast.error(e.message),
  });

  const onSubmit = async (data: SignUpFormData) => {
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
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-right font-medium text-foreground">
                    First Name
                  </FormLabel>
                  <Input placeholder="John" {...field} />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-right font-medium text-foreground">
                    Last Name
                  </FormLabel>
                  <Input placeholder="Doe" {...field} />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({field}) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-right font-medium text-foreground">
                    Empresa
                  </FormLabel>
                  <Input placeholder="Pet Spa" {...field} />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="col-span-2">
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
                <FormItem className="col-span-2">
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

            <Button
              isLoading={isPending}
              type="submit"
              className="h-11 col-span-2"
            >
              Register
            </Button>
          </div>
        </Form>
      </form>
    </div>
  );
}
