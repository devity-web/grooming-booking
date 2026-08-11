import Image from 'next/image';
import {cn} from '@/lib/utils';

export function Logo({className}: {className?: string}) {
  return (
    <div
      className={cn(
        'flex size-16 items-center justify-center rounded-full bg-primary/10',
        className,
      )}
    >
      <Image
        quality={100}
        alt="Logo"
        src="/images/logo-new.png"
        width={64}
        height={64}
      />
    </div>
  );
}
