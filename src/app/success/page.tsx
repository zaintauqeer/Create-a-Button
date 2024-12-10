'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      const encodedData = searchParams.get('data');
      const totalAmount = searchParams.get('totalAmount');
      if (!sessionId || !encodedData) {
        console.error('Missing session ID or form data');
        return;
      }

      console.log(sessionId);

      try {
        const formData = JSON.parse(decodeURIComponent(encodedData));
        console.log(formData);
    
        // Send data to your backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/addOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            name: formData.firstName + ' ' + formData.lastName,
            email: formData.guestEmail,
            contact: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            zipCode: formData.zipCode,
            totalAmount: totalAmount,
            shippingCost: 0,
            subTotal: totalAmount,
          }),
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
        <p className="text-gray-600">
          Thank you for your purchase. We'll send you a confirmation email shortly.
        </p>
      </div>
    </div>
  );
} 