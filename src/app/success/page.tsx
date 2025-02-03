'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { buttonVariants } from '@/components/ui/button'

export default function SuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      const orderId = searchParams.get('orderId');
      const totalAmount = parseInt(searchParams.get('totalAmount') || '0');

      const statusFormData = new FormData();
      statusFormData.append('orderId', orderId || '');
      statusFormData.append('paymentStatus', "success");

      if (!sessionId) {
        console.error('Missing session ID or form data');
        return;
      }

      const image = localStorage.getItem("previewImage");

      try {
        // Send data to your backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/order/addOrder`, {
          method: 'POST',
          body: statusFormData,
        });

        if (!response.ok) {
          throw new Error('Failed to save order data');
        }
        console.log(response);
        // Handle successful save
        console.log('Order data saved successfully');
        
      } catch (error) {
        console.error('Error processing success:', error);
      }
    };

    handleSuccess();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-green-500">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-2xl font-bold">Payment Successful!</h1>
        <p className="text-gray-600 mb-10">
          Thank you for your purchase. We'll send you a confirmation email shortly.
        </p>
        <Link
            href='/'
            className={buttonVariants({
                size: 'lg',
                className: 'flex items-center gap-1 text-xl',
            })}>
            Continue
        </Link>
      </div>
    </div>
  );
} 