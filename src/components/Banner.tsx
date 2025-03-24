'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import styles from './banner.module.css'
import Image from 'next/image'
import { useSession } from 'next-auth/react';

interface UserProfile {
    name: string;
    email: string;
    tel: string;
    createdAt: string;
}

export default function Banner() {
    const covers = ['/img/cover.jpg' , '/img/cover2.jpg' , '/img/cover3.jpg' , '/img/cover4.jpg']
    const [index, setIndex] = useState(0)
    const router = useRouter()

    const { data: session } = useSession()
    console.log("Session:", session);
    // console.log(session?.user.token)
    console.log(session?.user.name)

    return (
        <div className={styles.banner} onClick={ ()=>{ setIndex(index+1) } }  >
            <Image src={covers[index%4]} 
            alt='cover'
            fill={true}
            priority
            objectFit='cover'
            />

            {
                session? <div className='z-30 absolute top-5 right-10 font-semibold text-white text-xl'>
                    Welcome {session.user?.name}</div>
                    : null
            }

            <div className={styles.bannerText}>
                <h1 className='text-4xl font-medium'>Relax, Rejuvenate, and Reserve with Ease</h1>
                <h4 className='text-lg font-serif'> your perfect massage experience starts here </h4>
            </div>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 mr-8 mb-5 rounded z-30 absolute bottom-0 right-0
                hover:bg-blue-800 hover:text-white hover:border-transparent'
                onClick={ (e)=>{ e.stopPropagation(); router.push('/massage') } }> 
                Select Massage Shops
            </button>
        </div>
        
    );
}