'use client'
import styles from './topmenu.module.css';
import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TopMenu() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  return (
    <div className='fixed top-0 left-0 right-0 z-30 h-[50px] flex flex-row bg-white
         border-b border-gray-300 items-center px-4 '>

      <div className="flex flex-row items-center gap-6 w-50px">
        {
          status === 'loading' ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : session ? (
            <Link href="/api/auth/signout" className="text-cyan-600 text-sm hover:underline">
              Sign-Out of {session.user?.name}
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="text-cyan-600 text-sm hover:underline">
              Sign-In
            </Link>
          )
        }

        <div className="flex flex-row gap-3">
          {/* Role-specific buttons */}
          {session && role === 'therapist' && (
            <TopMenuItem title='My Profile' pageRef='/therapist/profile' />
          )}

          {session && (role === 'user' || role === 'admin') && (
            <TopMenuItem
              title={role === 'admin' ? 'Manage Reservation' : 'My Reservation'}
              pageRef='/myreservation'
            />
          )}

          {session && role === 'admin' && (
            <TopMenuItem
              title='Manage Therapists' pageRef='/therapist'
            />
          )}

          {/* Shared */}
          <TopMenuItem 
            // title='All Review' 
            title={role === 'admin' ? 'Manage Review' : 'All Review'}
            pageRef='/myreview' />
            <TopMenuItem 
            // title='All Review' 
            title={'View Therapist'}
            pageRef='/profile' />
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className='w-[90px]'>
        <TopMenuItem title='Reservation' pageRef='/reservation' />
      </div>
      <div className='w-[70px]'>
        <TopMenuItem title='Home' pageRef='/' />
      </div>

      <Image
        src={'/img/logo.png'}
        alt='logo'
        width={50}
        height={50}
      />
    </div>
  );
}
