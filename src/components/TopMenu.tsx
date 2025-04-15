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
              title={role === 'admin' ? 'All Reservation' : 'My Reservation'}
              pageRef='/myreservation'
            />
          )}

          {/* Shared */}
          {session && <TopMenuItem title='All Review' pageRef='/myreview' />}
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



// 'use client'
// import styles from './topmenu.module.css';
// import Image from 'next/image';
// import TopMenuItem from './TopMenuItem';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
// import Link from 'next/link';
// import { useSession, signIn, signOut } from 'next-auth/react'

// // export default async function TopMenu() {
// export default function TopMenu() {
//     // const session = await getServerSession(authOptions);
//     const { data: session, status } = useSession()

//     return (
//         <div className='fixed top-0 left-0 right-0 z-30 h-[50px] flex flex-row bg-white
//          border-b border-gray-300 items-center px-4'>

//             <div className="flex flex-row items-center gap-6">

//                 {
//                     status === 'loading' ? (
//                         <span className="text-sm text-gray-500">Loading...</span>
//                     ) : session ? (
//                         <Link href="/api/auth/signout"
//                             className="text-cyan-600 text-sm hover:underline">
//                             Sign-Out of {session.user?.name}
//                         </Link>
//                     ) : (
//                         <Link href="/api/auth/signin"
//                             className="text-cyan-600 text-sm hover:underline">
//                             Sign-In
//                         </Link>
//                     )
//                 }

//                 <div className="flex flex-row gap-0">
//                     <TopMenuItem title='My Reservation' pageRef='/myreservation' />
//                     <TopMenuItem title='All Review' pageRef='/myreview' />
//                 </div>
//             </div>


//             <div className="flex-grow"></div>

//             <div className='w-[90px]'>
//                 <TopMenuItem title='Reservation' pageRef='/reservation' />
//             </div>
//             <div className='w-[70px]'>
//                 <TopMenuItem title='Home' pageRef='/' />
//             </div>

//             <Image
//                 src={'/img/logo.png'}
//                 alt='logo'
//                 width={50} height={50}
//             />
//         </div>
//     );
// }
