'use client';

import { Environment } from '@/(labs)/_interfaces/environment';
import { buttonVariants } from '@repo/ui/button';
import Link from 'next/link';
import {
  BsClipboardData,
  BsPersonSquare,
  BsEnvelopePaper,
  BsShield,
  BsGear,
} from 'react-icons/bs';
import useUserSession from '@labs/_hooks/use-user-session';
import { usePathname } from 'next/navigation';
import Utils from '@repo/utils';
import { Avatar, AvatarFallback } from '@repo/ui/avatar';
import ProjectEnvNav from './project-env-nav';
import { UserSession } from '../_services/server-auth-provider';
import dynamic from 'next/dynamic';
import { Typo } from '@repo/ui/typo';
import { IconType } from 'react-icons';
import { cn } from '@repo/ui/core/utils';

const Logo = dynamic(() => import('@/_components/logo'), { ssr: false });

type Props = {
  environment: Environment;
  session: UserSession;
};

function NavItem({
  icon,
  label,
  className,
  ...props
}: { icon: IconType; label: string } & React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const href = props.href.toString();

  return (
    <Link
      aria-label={label}
      {...props}
      className={buttonVariants({
        variant: 'linkGhost',
        size: 'sm',
        className: cn(
          'flex items-center gap-2.5 w-full !justify-start !p-2 !font-normal',
          {
            '!text-zinc-900 dark:!text-zinc-50 bg-accent pointer-events-none':
              href !== '/' ? href === pathname : href.startsWith(pathname),
          },
          className,
        ),
      })}
    >
      {icon({ className: 'w-4 h-4' })} {label}
    </Link>
  );
}

export default function MainAside({ environment, session }: Props) {
  const { environment: clientEnvironment, user } = useUserSession();
  const pathname = usePathname();

  return (
    !pathname.startsWith('/projects') &&
    (clientEnvironment || environment) && (
      <aside className="w-64 fixed top-0 left-0 border-r border-collapse bg-card flex flex-col justify-between px-1.5 py-2 h-screen pb-1.5">
        <div className="flex justify-center items-center gap-1 py-1.5 pl-2">
          <div className="px-1 flex-none basis-7">
            <Logo reduced className="h-5 -mt-0.5" />
          </div>
          <ProjectEnvNav environment={environment as Environment} />
        </div>

        <nav className="w-full flex flex-col justify-between pt-3 pb-2 px-1.5 h-[94vh]">
          <div className="flex flex-col gap-2 w-full">
            <NavItem label="Dashboard" href="/" icon={BsClipboardData} />
            <NavItem label="Users" href="/users" icon={BsPersonSquare} />
            <NavItem label="Emails" href="/emails" icon={BsEnvelopePaper} />
            <NavItem label="Settings" href="/settings" icon={BsGear} />
          </div>

          <div className="flex items-center gap-2 w-full">
            <Avatar size="sm" className="cursor-default select-none">
              <AvatarFallback>
                {Utils.getFirstAndLastInitials(
                  user?.fullName || session?.user?.fullName || '',
                )}
              </AvatarFallback>
            </Avatar>
            <Typo variant={'sm'}>
              {user?.fullName || session?.user?.fullName || ''}
            </Typo>
          </div>
        </nav>
      </aside>
    )
  );
}