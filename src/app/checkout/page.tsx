'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormErrors {
	guestEmail?: string;
	firstName?: string;
	lastName?: string;
	address?: string;
	city?: string;
	country?: string;
	phone?: string;
	zipCode?: string;
}

export default function CheckoutPage() {
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		guestEmail: '',
		firstName: '',
		lastName: '',
		address: '',
		city: '',
		country: 'United States',
		phone: '',
		zipCode: '',
	});
	const productPrice = searchParams.get('productPrice');
	console.log(productPrice);
	const [errors, setErrors] = useState<FormErrors>({});
	const [paymentMethod, setPaymentMethod] = useState('credit-card');
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
	};
	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};
		Object.keys(formData).forEach((key) => {
			if (!formData[key as keyof typeof formData]) {
				newErrors[key] = 'This field is required';
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const createStripeCheckoutSession = async (orderId: string) => {
		try {
			const response = await fetch('api/create-stripe-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					formData,
					orderId,
					items: [
						{
							price: 'price_1QUNX8BqUGk2zLFg5VoOocJ4', // Your Stripe price ID
							quantity: 1,
						}
					],
				}),
			});

			const { url } = await response.json();
			console.log(url);
			window.location.href = url;
		} catch (error) {
			console.error('Error creating Stripe session:', error);
		}
	};

	// const createPayPalOrder = async () => {
	// 	try {
	// 		const response = await fetch('/api/create-paypal-order', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				formData,
	// 				items: [
	// 					{
	// 						price: 12.00, // Your product price
	// 						quantity: 1,
	// 					}
	// 				],
	// 			}),
	// 		});

	// 		const { approvalUrl } = await response.json();
	// 		window.location.href = approvalUrl; // Redirect to PayPal
	// 	} catch (error) {
	// 		console.error('Error creating PayPal order:', error);
	// 	}
	// };

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validateForm()) {
			setIsLoading(true);
			try {
				// Retrieve the image data from local storage
				const imageData = localStorage.getItem('previewImage');
				if (!imageData) {
					throw new Error('No image data found in local storage');
				}

				// Convert base64 to a Blob
				const byteString = atob(imageData.split(',')[1]);
				const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
				const ab = new ArrayBuffer(byteString.length);
				const ia = new Uint8Array(ab);
				for (let i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				const blob = new Blob([ab], { type: mimeString });

				// Create a File object
				const file = new File([blob], 'image.png', { type: mimeString });

				const totalAmount = 12.00;
				// Prepare form data
				let cart = [{
					title: "Button",
					orderQuantity:1,
					price:totalAmount,
					originalPrice:totalAmount,
					status:"active",
				}]
				const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
				const newFormData = new FormData();
				newFormData.append('orderId', uniqueId);
				newFormData.append('email', formData.guestEmail);
				newFormData.append('name', formData.firstName + ' ' + formData.lastName);
				newFormData.append('lastName', formData.lastName);
				newFormData.append('address', formData.address);
				newFormData.append('city', formData.city);
				newFormData.append('country', formData.country);
				newFormData.append('contact', formData.phone);
				newFormData.append('zipCode', formData.zipCode);
				newFormData.append('totalAmount', totalAmount.toString());
				newFormData.append('shippingCost', '0');
				newFormData.append('subTotal', totalAmount.toString());
				newFormData.append('cart', JSON.stringify(cart));
				newFormData.append('image', file);
				newFormData.append('paymentMethod', paymentMethod);
				// Send data to your backend
				const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/addOrder`, {
					method: 'POST',
					body: newFormData,
				});

				if (!orderResponse.ok) {
					throw new Error('Failed to create order');
				}

				const orderData = await orderResponse.json();

				// Then proceed with Stripe checkout
				if (paymentMethod === 'credit-card') {
					await createStripeCheckoutSession(uniqueId);
				} 
				// else if (paymentMethod === 'paypal') {
				// 	await createPayPalOrder();
				// }
			} catch (error) {
				console.error('Payment error:', error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
			<form onSubmit={handleSubmit} className="mx-auto max-w-screen-xl px-4 2xl:px-0">
				<ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
					<li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
						<span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
							<svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
							Cart
						</span>
					</li>

					<li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
						<span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
							<svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
							Checkout
						</span>
					</li>

					<li className="flex shrink-0 items-center">
						<svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
						Order summary
					</li>
				</ol>

				<div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
					<div className="min-w-0 flex-1 space-y-8">
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h2>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> First name </label>
									<input name="firstName" type="text" id="firstName" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green"
										value={formData?.firstName || ''}
										onChange={handleInputChange} />
									{errors?.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
								</div>

								<div>
									<label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Last name </label>
									<input name="lastName" type="text" id="lastName" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green"
										value={formData.lastName}
										onChange={handleInputChange} />
									{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
								</div>

								<div>
									<label htmlFor="guestEmail" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your email* </label>
									<input name="guestEmail" type="email" id="guestEmail" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="name@flowbite.com"
										value={formData.guestEmail}
										onChange={handleInputChange} />
									{errors.guestEmail && <p className="text-red-500 text-sm">{errors.guestEmail}</p>}
								</div>

								<div>
									<label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Address </label>
									<input name="address" type="text" id="address" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green"
										value={formData.address}
										onChange={handleInputChange} />
									{errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
								</div>

								<div>
									<div className="mb-2 flex items-center gap-2">
										<label htmlFor="city" className="block text-sm font-medium text-gray-900 dark:text-white"> City* </label>
									</div>
									<input name="city" type="text" id="city" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green"
										value={formData.city}
										onChange={handleInputChange} />
									{errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
								</div>

								<div>
									<div className="mb-2 flex items-center gap-2">
										<label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white"> Country* </label>
									</div>
									<select name="country" id="country" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
										value={formData.country}
										onChange={handleInputChange} >
										<option selected>United States</option>
										<option value="AS">Australia</option>
										<option value="FR">France</option>
										<option value="ES">Spain</option>
										<option value="UK">United Kingdom</option>
									</select>
									{errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
								</div>



								<div>
									<label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
									<div className="flex items-center">
										<div className="relative w-full">
										{/* pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" */}
											<input name="phone" type="text" id="phone" className="z-20 block w-full rounded-lg border  border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"  placeholder="123-456-7890"
												value={formData.phone}
												onChange={handleInputChange} />
											{errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
										</div>
									</div>
								</div>

								<div>
									<label htmlFor="zipCode" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Zip Code </label>
									<input name="zipCode" type="text" id="zipCode" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Flowbite LLC"
										value={formData.zipCode}
										onChange={handleInputChange} />
									{errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
									<div className="flex items-start">
										<div className="flex h-5 items-center">
											<input id="credit-card" aria-describedby="credit-card-text" type="radio" name="payment-method" value="credit-card" className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
												checked={paymentMethod === 'credit-card'}
												onChange={(e) => setPaymentMethod(e.target.value)} />
										</div>

										<div className="ms-4 text-sm">
											<label htmlFor="credit-card" className="font-medium leading-none text-gray-900 dark:text-white"> Credit Card </label>
											<p id="credit-card-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay with your credit card</p>
										</div>
									</div>


								</div>


								{/* <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
									<div className="flex items-start">
										<div className="flex h-5 items-center">
											<input id="paypal-2" aria-describedby="paypal-text" type="radio" name="payment-method" value="paypal" className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
												checked={paymentMethod === 'paypal'}
												onChange={(e) => setPaymentMethod(e.target.value)} />
										</div>

										<div className="ms-4 text-sm">
											<label htmlFor="paypal-2" className="font-medium leading-none text-gray-900 dark:text-white"> Paypal account </label>
											<p id="paypal-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Connect to your account</p>
										</div>
									</div>


								</div> */}
							</div>
						</div>

					</div>

					<div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
						<div className="flow-root">
							<div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
								<dl className="flex items-center justify-between gap-4 py-3">
									<dt className="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
									<dd className="text-base font-medium text-gray-900 dark:text-white">$12.00</dd>
								</dl>

								<dl className="flex items-center justify-between gap-4 py-3">
									<dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
									<dd className="text-base font-medium text-green-500">0</dd>
								</dl>



								<dl className="flex items-center justify-between gap-4 py-3">
									<dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
									<dd className="text-base font-bold text-gray-900 dark:text-white">$12.00</dd>
								</dl>
							</div>
						</div>

						<div className="space-y-3">
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? 'Processing...' : 'Proceed to Payment'}
							</Button>
							<p className="text-sm font-normal text-gray-500 dark:text-gray-400">One or more items in your cart require an account. <a href="#" title="" className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Sign in or create an account now.</a>.</p>
						</div>
					</div>
				</div>
			</form>
		</section>
	);
}
