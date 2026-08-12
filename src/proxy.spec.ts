import {NextRequest, NextResponse} from 'next/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

const {updateSession} = vi.hoisted(() => ({
  updateSession: vi.fn(),
}));

vi.mock('./lib/supabase/proxy', () => ({updateSession}));

import {config, proxy} from './proxy';

describe('proxy', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    updateSession.mockReset();
  });

  it('passes the request to updateSession and returns its response', async () => {
    const request = new NextRequest('https://toskio.test/happy-paws/dashboard');
    const expectedResponse = NextResponse.next();
    updateSession.mockResolvedValue(expectedResponse);
    const consoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const response = await proxy(request);

    expect(updateSession).toHaveBeenCalledOnce();
    expect(updateSession).toHaveBeenCalledWith(request);
    expect(response).toBe(expectedResponse);
    expect(consoleLog).toHaveBeenCalledOnce();
    expect(consoleLog).toHaveBeenCalledWith('[proxy] execute updateSession');
  });

  it('propagates errors from updateSession', async () => {
    const request = new NextRequest('https://toskio.test/dashboard');
    const error = new Error('Unable to refresh session');
    updateSession.mockRejectedValue(error);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await expect(proxy(request)).rejects.toBe(error);
    expect(updateSession).toHaveBeenCalledOnce();
    expect(updateSession).toHaveBeenCalledWith(request);
  });

  it('exports the routes handled by the proxy', () => {
    expect(config).toEqual({
      matcher: [
        '/((?!$|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      ],
    });
  });
});
