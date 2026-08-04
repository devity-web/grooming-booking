'use server';

import {createClient} from '@/lib/supabase/server';

export async function uploadAvatar(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const supabase = await createClient();

  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Unauthorized');

  // 2. Format the file name to prevent caching issues
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  // 3. Upload to Supabase Storage
  const {error: uploadError} = await supabase.storage
    .from('dev') // Replace with your actual bucket name
    .upload(filePath, file, {upsert: true});

  if (uploadError) {
    throw new Error('Failed to upload image');
  }

  const {
    data: {publicUrl},
  } = supabase.storage.from('dev').getPublicUrl(filePath);

  const {error: updateError} = await supabase.auth.updateUser({
    data: {avatar_url: publicUrl},
  });

  if (updateError) throw new Error('Failed to update user profile');

  return publicUrl;
}
