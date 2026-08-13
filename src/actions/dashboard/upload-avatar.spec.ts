import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {createClient, from, getPublicUrl, getUser, updateUser, upload} =
  vi.hoisted(() => ({
    createClient: vi.fn(),
    from: vi.fn(),
    getPublicUrl: vi.fn(),
    getUser: vi.fn(),
    updateUser: vi.fn(),
    upload: vi.fn(),
  }));

vi.mock('@/lib/supabase/server', () => ({createClient}));

import {uploadAvatar} from './upload-avatar';

function createFormData() {
  const formData = new FormData();
  formData.set(
    'file',
    new File(['avatar'], 'profile.png', {type: 'image/png'}),
  );
  return formData;
}

describe('uploadAvatar', () => {
  beforeEach(() => {
    createClient.mockResolvedValue({
      auth: {getUser, updateUser},
      storage: {from},
    });
    from.mockReturnValue({getPublicUrl, upload});
    getUser.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    upload.mockResolvedValue({error: null});
    getPublicUrl.mockReturnValue({
      data: {publicUrl: 'https://cdn.test/avatar.png'},
    });
    updateUser.mockResolvedValue({error: null});
    vi.spyOn(Date, 'now').mockReturnValue(1_723_000_000_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    createClient.mockReset();
    from.mockReset();
    getPublicUrl.mockReset();
    getUser.mockReset();
    updateUser.mockReset();
    upload.mockReset();
  });

  it('rejects requests without a file', async () => {
    await expect(uploadAvatar(new FormData())).rejects.toThrow(
      'No file provided',
    );
    expect(createClient).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated users', async () => {
    getUser.mockResolvedValue({
      data: {user: null},
      error: new Error('Invalid session'),
    });

    await expect(uploadAvatar(createFormData())).rejects.toThrow(
      'Unauthorized',
    );
    expect(from).not.toHaveBeenCalled();
  });

  it('uploads the avatar and stores its public URL on the user', async () => {
    await expect(uploadAvatar(createFormData())).resolves.toBe(
      'https://cdn.test/avatar.png',
    );
    const filePath = 'user-1/user-1-1723000000000.png';
    expect(from).toHaveBeenNthCalledWith(1, 'avatars');
    expect(upload).toHaveBeenCalledWith(
      filePath,
      expect.objectContaining({name: 'profile.png'}),
      {upsert: true},
    );
    expect(from).toHaveBeenNthCalledWith(2, 'avatars');
    expect(getPublicUrl).toHaveBeenCalledWith(filePath);
    expect(updateUser).toHaveBeenCalledWith({
      data: {avatar_url: 'https://cdn.test/avatar.png'},
    });
  });

  it('rejects storage upload failures', async () => {
    upload.mockResolvedValue({error: new Error('Storage unavailable')});

    await expect(uploadAvatar(createFormData())).rejects.toThrow(
      'Failed to upload image',
    );
    expect(getPublicUrl).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('rejects profile update failures', async () => {
    updateUser.mockResolvedValue({error: new Error('Update failed')});

    await expect(uploadAvatar(createFormData())).rejects.toThrow(
      'Failed to update user profile',
    );
  });
});
