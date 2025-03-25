import Image from "next/image";
import styles from "./page.module.css";
import Banner from "@/components/Banner";
// import Card from "@/components/Card";
import MassageCatalog from "@/components/MassageCatalog";
import getMassageShops from "@/libs/getMassageShops";
export default function Home() {
  const massage=getMassageShops();
  return (
    <main>
      <Banner/>
      <div>
        <h3 className='text-4xl font-medium m-10'>Browse popular massage shops, check availability, and reserve your favorite spot — all in one place.</h3>
        <div className="bg-slate-100 rounded-lg px-10 py-5 space-y-5 flex flex-col m-10">
        <h3 className='text-4xl font-medium text-blue-800'>Popular Massage Types</h3>
        <div>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Thai Massage
            </button>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Aromatherapy Massage
            </button>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Hot Stone Massage
            </button>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Serenity Spa
            </button>
        </div>
        <MassageCatalog massageJson={massage}/>
        </div>
        <div className="bg-slate-100 rounded-lg px-10 py-5 space-y-5 flex flex-col m-10">
        <h3 className='text-4xl font-medium text-blue-800'>Popular Massage Areas</h3>
        <div>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Thai Massage
            </button>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Aromatherapy Massage
            </button>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Hot Stone Massage
            </button>
            <button className='bg-white text-blue-800 border border-blue-800
                font-semibold py-2 px-2 m-2 rounded z-30
                hover:bg-blue-800 hover:text-white hover:border-transparent'> 
                Serenity Spa
            </button>
        </div>
        <MassageCatalog massageJson={massage}/>
        </div>
      </div>
    </main>
  );
}
