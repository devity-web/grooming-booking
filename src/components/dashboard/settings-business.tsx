'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconHelp,
  IconLink,
} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {useRouter, useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import z from 'zod';
import {updateBusiness} from '@/actions/dashboard/update-business';
import type {Business} from '@/app/generated/prisma/client';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import {Button} from '../ui/button';
import {Card, CardContent, CardFooter} from '../ui/card';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';

const formSchema = z.object({
  name: z.string(),
  url: z.string().trim().min(4, 'Please provide at least 4 characters'),
  address: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function SettingsBusiness({business}: {business: Business}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      formSchema,
      {},
      {
        mode: 'async',
      },
    ),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: business,
  });

  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const search = useSearchParams();

  const {mutate, isPending} = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await updateBusiness(business.id, values);

      form.resetDefaultValues(response.business);
      return response;
    },
    onSuccess: data => {
      toast.success('Business data successfully updated');
      if (data.shouldRefresh) {
        router.replace(`/${data.business.url}/dashboard/settings?new=true`);
      }
    },
    onError: () => toast.error('Ops... Something went wrong.'),
  });

  const onSubmit = (values: FormData) => {
    mutate(values);
  };

  const handleValdiate = async () => {
    setValidating(true);

    const slug = form.watch('url');

    const response = await fetch(
      `/api/url-check?slug=${encodeURIComponent(slug)}`,
    );

    if (!response.ok) {
      form.setError('url', {
        message: 'This url is already taken',
      });
    }

    setIsValid(response.ok);
    setValidating(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        {search.get('new') && (
          <Alert className="w-full mb-2.5 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <IconAlertTriangle />
            <AlertTitle>Your business url was changed.</AlertTitle>
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span>
                  Please take note to share your new url with your customers.
                  <br />
                  Your new appointment link is{' '}
                  <span className="font-bold">
                    http://localhost:3000/{business.url}/appointment
                  </span>
                </span>
                <Button>
                  <IconLink />
                  Share
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Nome
                    </FormLabel>
                    <Input placeholder="Pet Spa Lda" {...field} />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      URL de Agendamento
                    </FormLabel>
                    <div className="relative">
                      <IconLink className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="pet-spa"
                        disabled={validating}
                        {...field}
                      />
                      <Button
                        onClick={handleValdiate}
                        isLoading={validating}
                        variant="outline"
                        disabled={
                          form.watch('url') === business.url ||
                          !!form.formState.errors.url
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 animate-none"
                      >
                        {isValid ? (
                          <>
                            <IconCircleCheck className="text-green-400" />
                            <span className="text-green-400">Valid</span>
                          </>
                        ) : (
                          <>
                            <IconHelp />
                            Check
                          </>
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({field}) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-right font-medium text-foreground">
                      Address
                    </FormLabel>
                    <Input placeholder="Rua, Avenida..." {...field} />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              onClick={() => form.reset()}
              disabled={isPending}
              variant="outline"
            >
              Reset
            </Button>
            <Button
              isLoading={isPending}
              disabled={form.watch('url') !== business.url && !isValid}
              type="submit"
            >
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  );
}
