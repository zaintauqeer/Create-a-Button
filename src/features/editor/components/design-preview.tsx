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
import { SmallNavbar } from './smallNavbar'

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
    const [quantity, setQuantity] = useState<number>(1);
    const [finalPrice, setFinalPrice] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getLocalStorageData = async () =>{
		const imgData = await localStorage.getItem("previewImage");
		
		if (imgData) {
			setImageSrc(imgData);
			setIsLoading(false);

		} else {
			setIsLoading(false);
		}
	}

    useEffect(() => {
        getLocalStorageData()
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
                const urlParams = new URLSearchParams(window.location.search);
		        const sizeParam = urlParams.get('size');
                if (sizeParam && data.data[0].sizes[sizeParam]) {
                    console.log(sizeParam);
                    let newPrice = data.data[0].price + parseInt(data.data[0].sizes[sizeParam].price);
                    setNewPrice(newPrice);
                    setSizePrice(parseInt(data.data[0].sizes[sizeParam].price));
                    setProductSize(data.data[0].sizes[sizeParam].productSize);
                    setSelectedSize(data.data[0].sizes[sizeParam].name)
                } else {
                    console.warn('Size parameter is invalid or not found');
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        getAllProducts();
    }, []);

    function selectSize(event: React.ChangeEvent<HTMLSelectElement>) {
        const size = event.target.value
        let sizeArray = size.split(",")
        setSelectedSize(sizeArray[0])
        let newPrice = (firstProductPrice?firstProductPrice:0) + typePrice + parseInt(sizeArray[1]?sizeArray[1]:"0")
        setSizePrice(parseInt(sizeArray[1]?sizeArray[1]:"0"))
        setNewPrice(newPrice)
        setProductSize(parseInt(sizeArray[2]?sizeArray[2]:""))
        setFinalPrice(newPrice * quantity)
    }
    function selectBacktype(event: React.ChangeEvent<HTMLSelectElement>) {
        const type = event.target.value;
        let typeArray = type.split(",");
        setSelectedBackgroundType(typeArray[0]);
        let newPrice = (firstProductPrice ? firstProductPrice : 0) + sizePrice + parseInt(typeArray[1] ? typeArray[1] : "0");
        setTypePrice(parseInt(typeArray[1] ? typeArray[1] : "0"));
        setNewPrice(newPrice);
        setFinalPrice(newPrice * quantity)
    }
    function reduceQuantity() {
        setQuantity(quantity > 1 ? quantity - 1 : 1)
        const updatedPrice = newPrice?newPrice * (quantity>1?quantity-1:1):newPrice;
        setFinalPrice(updatedPrice);
    }
    function increaseQuantity() {
        setQuantity(quantity + 1)
        const updatedPrice = newPrice?newPrice * (quantity+1):newPrice;
        setFinalPrice(updatedPrice);
    }
    function handleCheckout() {
        if (selectedSize) {
            const checkoutData = {
                name:products[0].title,
                size:selectedSize,
                price:newPrice,
                totalAmount:finalPrice,
                backType:selectedBackgroundType,
                productSize:productSize,
                quantity:quantity
            }; 
            const encryptedData = btoa(JSON.stringify(checkoutData)); // Encrypting the data
            localStorage.setItem("checkoutData", encryptedData);
            router.push('/checkout');
        } else {
            console.error('No size selected for checkout');
            alert("Select Size")
        }
    }

    if(imageSrc && isLoading==false){
        return (
            <>
                <SmallNavbar/>
                <div className='p-4 lg:px-[34px] bg-muted min-h-[calc(100vh-68px)]'>
                    <h3 className='text-2xl mb-4 mt-4 font-bold tracking-tight text-gray-900'>
                        Your Shoping Cart
                    </h3>
                    <div className='grid md:grid-cols-12 grid-cols-1 gap-12'>
                        <div className='md:col-span-8'>
                            <div className="cart-box bg-white rounded-lg p-4 border">
                                <div className="flex gap-6 items-start">
                                    <TemplateButton
                                        className={cn("max-w-[100px]")}
                                        imgSrc={imageSrc|| ""}
                                    />
                                    <div className='w-full'>
                                        <h5 className='text-base font-bold'>{products[0]?.title}</h5>
                                        <p className='text-slate-500 mb-3 text-sm '>{products[0]?.description}</p>
                                        <div className="flex gap-3 items-center flex-wrap">
                                            {loading ? (
                                                <div className='block h-10 mt-3'>
                                                    <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                                        <p>
                                                            <Skeleton className='h-10' count={1} />
                                                        </p>
                                                    </SkeletonTheme>
                                                </div>
                                            ):
                                                <select defaultValue={""} onChange={selectSize} className='block outline-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500' name="" id="">
                                                    <option value="" hidden>Select Size</option>
                                                    {products[0]?.sizes?.map((size: {name:string,price:number,_id:string,productSize:string}) => {
                                                        return (
                                                            <option key={size._id} value={size.name+","+size.price+","+size.productSize}>{size.name} {`${size.price?'+$'+size.price:""}`}</option>
                                                        );
                                                    })}
                                                </select>
                                            }
                                            {loading ? (
                                                <div className='block h-10 mt-3'>
                                                    <SkeletonTheme  baseColor="#eef" highlightColor="#C0C0C0">
                                                        <p>
                                                            <Skeleton className='h-10' count={1} />
                                                        </p>
                                                    </SkeletonTheme>
                                                </div>
                                            ):
                                                <select defaultValue={""} onChange={selectBacktype} className='block outline-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500' name="" id="">
                                                    <option value="" hidden>Choose Back Type</option>
                                                    {products[0]?.backType?.map((backType: { name: string; _id:string; image: string; price:number }) => {
                                                        return (
                                                            <option key={backType._id} value={`${backType.name},${backType.price?backType.price:0}`} >{backType.name} {`${backType.price?'+$'+backType.price:""}`}</option>
                                                        );
                                                    })}
                                                </select>
                                            }
    
                                            <div className="flex items-center lg:ms-auto border rounded-lg">
                                                <button 
                                                    onClick={reduceQuantity} 
                                                    className="px-2.5 bg-transparent py-2.5 border-none rounded-l-lg"
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type="number" 
                                                    value={quantity} 
                                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
                                                    className="w-16 outline-none pointer-events-none text-center border-none rounded-lg" 
                                                    min="1"
                                                />
                                                <button 
                                                    onClick={increaseQuantity} 
                                                    className="px-2.5 bg-transparent border-none py-2.5 border rounded-r-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p>$ {finalPrice!==undefined?finalPrice:newPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='md:col-span-4'>
                            <div className='bg-white border p-4 rounded-lg'>
                                <h5 className='text-base font-bold'>Order Summary</h5>
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
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>Quantity</p>
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
                                                {quantity}x
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
                                                $ {finalPrice!==undefined?finalPrice:newPrice}
                                            </p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='mt-8 flex justify-end pb-12'>
                                <Button
                                    disabled={selectedBackgroundType == null}
                                    onClick={() => handleCheckout()}
                                    className='px-4 sm:px-6 lg:px-8'>
                                    Check out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                                </Button>
                            </div>
                        </div>
                    </div>
             
                </div>
            </>
        )
    } 
    else if(imageSrc==null && isLoading== false){
        return(
            <>
                <SmallNavbar/>
                <div className='p-4 lg:px-[34px] bg-muted min-h-[calc(100vh-68px)]'>
                    <div className="text-center">
                        <h2 className='text-4xl font-bold mb-8 mt-8'>You have no product in your cart</h2>
                        <Button
                            onClick={() => router.push('/')}
                            className='px-4 sm:px-6 lg:px-8'>
                            Design Now <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                        </Button>
                    </div>
                </div>
            </>
        )
    } else{
        return(
            <h1>Loading...</h1>
        )
    }
}

export default DesignPreview