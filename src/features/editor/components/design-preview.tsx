'use client'

import TemplateButton from '@/app/(dashboard)/templateButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
// import ProductVariations from './variations';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Product {
    id: string;
    name: string;
    variations: {
      buttonSize: string[];
      buttonBackgroundType: string[];
    };
  }

const DesignPreview = () => {
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [firstProductPrice, setfirstProductPrice] = useState<number>();
    const [newPrice, setNewPrice] = useState<number>();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedBackgroundType, setSelectedBackgroundType] = useState<string | null>(null);
    const [sizePrice, setSizePrice] = useState<number>(0);
    const [typePrice, setTypePrice] = useState<number>(0);
    const [productSize, setProductSize] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const savedImage = localStorage.getItem("previewImage");
        if (savedImage) {
            setImageSrc(savedImage);
        } 

        const getAllProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products/all`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data.data);
                setfirstProductPrice(data.data[0].price)
                setNewPrice(data.data[0].price)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        getAllProducts();
    }, []);

    function selectSize(event: React.ChangeEvent<HTMLSelectElement>) {
        console.log(event.target.getAttribute("data-price"))
        const size = event.target.value
        let sizeArray = size.split(",")
        setSelectedSize(sizeArray[0])
        let newPrice = (firstProductPrice?firstProductPrice:0) + typePrice + parseInt(sizeArray[1]?sizeArray[1]:"0")
        setSizePrice(parseInt(sizeArray[1]?sizeArray[1]:"0"))
        setNewPrice(newPrice)
        setProductSize(parseInt(sizeArray[2]?sizeArray[2]:""))
    }
    function selectBacktype(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event.target.getAttribute("data-price"));
        const type = event.target.value;
        let typeArray = type.split(",");
        setSelectedBackgroundType(typeArray[0]);
        let newPrice = (firstProductPrice ? firstProductPrice : 0) + sizePrice + parseInt(typeArray[1] ? typeArray[1] : "0");
        setTypePrice(parseInt(typeArray[1] ? typeArray[1] : "0"));
        setNewPrice(newPrice);
    }
    function handleCheckout() {
        if (selectedSize) {
            const checkoutData = {
                size:selectedSize,
                price:newPrice,
                backType:selectedBackgroundType,
                productSize:productSize
            }; 
            localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
            router.push('/checkout');
        } else {
            console.error('No size selected for checkout');
            alert("Select Size")
        }
    }
    return (
        <div className='container'>
            <div className='pt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12'>
                <div className='md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2'>
                    <TemplateButton
                        className={cn("max-w-[150px] md:max-w-full")}
                        imgSrc={imageSrc|| ""}
                    />
                </div>

                <div className='mt-6 sm:col-span-9 md:row-end-1'>
                    <h3 className='text-3xl font-bold tracking-tight text-gray-900'>
                        Your Custom Button
                    </h3>
                    <div className='mt-3 flex items-center gap-1.5 text-base'>
                        <Check className='h-4 w-4 text-green-500' />
                        In stock and ready to ship
                    </div>
                </div>

                <div className='sm:col-span-12 md:col-span-9 text-base'>
                    <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10'>
                        <div>
                            <p className='font-medium text-zinc-950'>Highlights</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Packaging made from recycled materials</li>
                                <li>5-year design guarantee</li>
                            </ol>
                        </div>
                        <div>
                            <p className='font-medium text-zinc-950'>Materials</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>High-quality, durable material</li>
                                <li>Scratch- and fingerprint resistant coating</li>
                            </ol>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <h2 className="text-lg font-semibold">Select Back Type</h2>
                        <div className="grid grid-cols-6">
                            <div className="">
                                {loading ? (
                                    <div className='block w-full h-10'>
                                        <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                            <p>
                                                <Skeleton className='h-10' count={1} />
                                            </p>
                                        </SkeletonTheme>
                                    </div>
                                ):
                                    <select onChange={selectSize} className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500' name="" id="">
                                        <option value="" selected hidden>Select Size</option>

                                        {console.log(products[0])}
                                    
                                        {products[0]?.sizes?.map((size: {name:string,price:number,_id:string,productSize:string}) => {
                                            return (
                                                <option key={size._id} value={size.name+","+size.price+","+size.productSize}>{size.name} {`${size.price?'+$'+size.price:""}`}</option>
                                            );
                                        })}
                                    </select>
                                }
                            </div>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold">Select Back Type</h2>
                            {loading ? (
                                    <div className='flex w-full h-10 gap-5'>
                                        <div className='h-10 w-10'>
                                            <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                                <p>
                                                    <Skeleton className='h-10 w-10' count={1} />
                                                </p>
                                            </SkeletonTheme>
                                        </div>
                                        <div className='h-10 w-10'>
                                            <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                                <p>
                                                    <Skeleton className='h-10 w-10' count={1} />
                                                </p>
                                            </SkeletonTheme>
                                        </div>
                                    </div>
                                ):
                            <div className="flex gap-5 mt-2 text-center items-start">
                                    {products[0]?.backType?.map((backType: { name: string; image: string; price:number }) => (
                                        <>
                                            <div className="flex flex-col mt-2 text-center">
                                                <label key={backType.name} className={`flex p-1 flex-col items-center mb-2 h-10 w-10 border-2 rounded-full ${selectedBackgroundType === backType.name ? 'border-primary shadow-lg' : 'border-cyan-950'}`}>
                                                    <input
                                                        type="radio"
                                                        name="backType"
                                                        value={`${backType.name},${backType.price?backType.price:0}`}
                                                        className="mr-2 hidden"
                                                        onChange={selectBacktype}
                                                    />
                                                    <img src={backType.image} alt={backType.name} className="h-10 w-10 rounded-full object-cover" />
                                                </label>
                                                <span className="text-gray-700">{backType.name}  {`${backType.price?'+$'+backType.price:""}`}</span>
                                            </div>
                                        </>
                                    ))}
                            </div>
                            }
                        </div>
                    </div>
                    {/* <ProductVariations /> */}
                    <div className='mt-8'>
                        <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
                            <div className='flow-root text-sm'>
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Base price</p>
                                    {loading ? (
                                        <div className='h-5 w-8'>
                                            <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                                <p>
                                                    <Skeleton className='h-5 w-8' count={1} />
                                                </p>
                                            </SkeletonTheme>
                                        </div>
                                    ):
                                        <p className='font-medium text-gray-900'>
                                            $ {newPrice}
                                        </p>
                                    }
                                </div>

                                <div className='my-2 h-px bg-gray-200' />

                                <div className='flex items-center justify-between py-2'>
                                    <p className='font-semibold text-gray-900'>Order total</p>
                                    {loading ? (
                                        <div className='h-5 w-8'>
                                            <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                                <p>
                                                    <Skeleton className='h-5 w-8' count={1} />
                                                </p>
                                            </SkeletonTheme>
                                        </div>
                                    ):
                                        <p className='font-semibold text-gray-900'>
                                            $ {newPrice}
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <div className='mt-8 flex justify-end pb-12'>
                            <Button
                                disabled={selectedBackgroundType == null || selectedSize == null}
                                onClick={() => handleCheckout()}
                                className='px-4 sm:px-6 lg:px-8'>
                                Check out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default DesignPreview