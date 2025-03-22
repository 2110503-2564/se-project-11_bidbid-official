import Image from 'next/image'
import InteractiveCard from './InteractiveCard';
import Rating from '@mui/material/Rating';

// export default function Card( { venueName, imgSrc, onRating, rating} : 
export default function Card( { massageName, imgSrc, onRating, rating} : 
    { massageName:string, imgSrc:string, onRating?:Function, rating?:number } ) {
    return (
        <InteractiveCard>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc} 
                alt="Card Picture" 
                fill={true}
                className='object-cover rounded-t-lg'
                />
            </div>

            <div className='w-full h-[15%] p-[10px]'>{massageName}</div>

            {
                onRating? <Rating className='h-[15%] p-[7px]'
                    id={`${massageName} Rating`}
                    name={`${massageName} Rating`}
                    data-testid={`${massageName} Rating`}
                    value={rating ?? 0}
                    onChange={ (e, newValue) => { e.stopPropagation(); onRating(massageName, newValue);} }
                    onClick={(e) => e.stopPropagation()}
                    /> : ''
            }

        </InteractiveCard>
    );
}