import Image from 'next/image'
import InteractiveCard from './InteractiveCard';
import Rating from '@mui/material/Rating';

export default function Card( { venueName, imgSrc, onRating, rating} : 
    { venueName:string, imgSrc:string, onRating?:Function, rating?:number } ) {
    return (
        <InteractiveCard>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc} 
                alt="Card Picture" 
                fill={true}
                className='object-cover rounded-t-lg'
                />
            </div>

            <div className='w-full h-[15%] p-[10px]'>{venueName}</div>

            {
                onRating? <Rating className='h-[15%] p-[7px]'
                    id={`${venueName} Rating`}
                    name={`${venueName} Rating`}
                    data-testid={`${venueName} Rating`}
                    value={rating ?? 0}
                    onChange={ (e, newValue) => { e.stopPropagation(); onRating(venueName, newValue);} }
                    onClick={(e) => e.stopPropagation()}
                    /> : ''
            }

        </InteractiveCard>
    );
}