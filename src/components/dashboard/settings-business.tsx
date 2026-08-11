'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import z from 'zod';
import {updateBusiness} from '@/actions/dashboard/update-business';
import type {Business} from '@/app/generated/prisma/client';
import {Button} from '../ui/button';
import {Card, CardContent, CardFooter} from '../ui/card';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';

const formSchema = z.object({
  name: z.string(),
  url: z.string(),
  address: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function SettingsBusiness({business}: {business: Business}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: business,
  });

  const {mutate, isPending} = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await updateBusiness(business.id, values);

      form.resetDefaultValues(response);
      return response;
    },
    onSuccess: () => {
      toast.success('Business data successfully updated');
    },
    onError: () => toast.error('Ops... Something went wrong.'),
  });

  const onSubmit = (values: FormData) => {
    mutate(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
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
                      URL
                    </FormLabel>
                    <Input placeholder="pet-spa" {...field} />

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
            <Button isLoading={isPending} type="submit">
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  );
}
