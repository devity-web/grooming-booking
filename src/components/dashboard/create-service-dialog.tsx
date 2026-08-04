'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {IconPlus} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import z from 'zod';
import {createService} from '@/actions/dashboard/create-service';
import {Button} from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Textarea} from '../ui/textarea';

const formSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string(),
  price: z.number().min(1, 'Must be at least 1').max(100, 'Must be under 100'),
});

type FormData = z.infer<typeof formSchema>;

export function CreateServiceDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });

  const {mutate, isPending} = useMutation({
    mutationFn: async (data: FormData) => await createService(data),
    onSuccess: () => {
      toast.success('Service successfully created');
    },
    onError: () => toast.error('Ops... Something went wrong'),
    onSettled: () => setOpen(false),
  });

  const onSubmit = (values: FormData) => {
    mutate(values);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button>
            <IconPlus />
            Create
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create a service</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="flex flex-col gap-4 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Name
                    </FormLabel>
                    <Input placeholder="Product name" {...field} />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Description
                    </FormLabel>
                    <Textarea
                      placeholder="A description for your service..."
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Price
                    </FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      value={field.value ?? ''} // Prevents React uncontrolled-to-controlled warning on empty/null values
                      onChange={e => {
                        const val = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(val) ? '' : val);
                      }}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button isLoading={isPending} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
}
