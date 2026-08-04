'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {IconCloudUpload} from '@tabler/icons-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import z from 'zod';
import {uploadAvatar} from '@/actions/dashboard/upload-avatar';
import {createClient} from '@/lib/supabase/client';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {Button} from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Skeleton} from '../ui/skeleton';
import {Spinner} from '../ui/spinner';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is mandatory'),
  lastName: z.string().min(1, 'Last name is mandatory'),
});

type FormData = z.infer<typeof formSchema>;

export function SettingsAccount() {
  const client = createClient();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {mutate, isPending} = useMutation({
    mutationFn: async (values: FormData) => {
      const {data, error} = await client.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
        },
      });
      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['auth', 'session']});
      toast.success('Your profile was successfully updated');
    },
    onError: () => toast.error('Ops... Something went wrong.'),
  });

  const {data, isLoading} = useQuery({
    queryKey: ['auth', 'data'],
    queryFn: async () => {
      const {data, error} = await client.auth.getUser();

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (data?.user) {
      const {first_name, last_name} = data.user.user_metadata;

      form.reset({
        firstName: first_name,
        lastName: last_name,
      });
    }
  }, [data, form]);

  const onSubmit = (values: FormData) => {
    mutate(values);
  };

  const {mutate: uploadAvatarMutation, isPending: isUploadingAvatar} =
    useMutation({
      mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return await uploadAvatar(formData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['auth', 'session']});
        toast.success('Avatar uploaded successfully');
      },
      onError: error => toast.error(error.message || 'Failed to upload avatar'),
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatarMutation(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Avatar and Button Skeleton */}
            <div className="flex gap-2 items-center col-span-2">
              <Skeleton className="size-24 rounded-full" />
              <Skeleton className="h-10 w-[130px] rounded-md" />
            </div>

            {/* First Name Field Skeleton */}
            <div className="space-y-3 mt-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>

            {/* Last Name Field Skeleton */}
            <div className="space-y-3 mt-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          {isLoading ? (
            <CardContent>
              <Spinner className="size-8" />
            </CardContent>
          ) : (
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2 items-center col-span-2">
                  <Avatar className="size-24">
                    <AvatarImage src={data?.user.user_metadata.avatar_url} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploadingAvatar}
                    variant="outline"
                  >
                    <IconCloudUpload />
                    Upload photo
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-right font-medium text-foreground">
                        First name
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
                        Last name
                      </FormLabel>
                      <Input placeholder="John" {...field} />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}
          <CardFooter className="flex gap-2">
            <Button disabled={isPending} variant="outline">
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
