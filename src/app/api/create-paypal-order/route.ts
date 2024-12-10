// import { NextResponse } from 'next/server';
// import paypal from '@paypal/checkout-server-sdk';

// // PayPal client configuration
// const environment = new paypal.core.SandboxEnvironment(
//   process.env.PAYPAL_CLIENT_ID!,
//   process.env.PAYPAL_CLIENT_SECRET!
// );
// const client = new paypal.core.PayPalHttpClient(environment);

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { formData, items } = body;

//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: 'CAPTURE',
//       purchase_units: [{
//         amount: {
//           currency_code: 'USD',
//           value: '12.00', // Calculate total from items
//         },
//       }],
//       application_context: {
//         return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//         cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
//       },
//     });

//     const order = await client.execute(request);
//     const approvalUrl = order.result.links.find(
//       (link) => link.rel === 'approve'
//     )?.href;

//     return NextResponse.json({ approvalUrl });
//   } catch (error) {
//     console.error('PayPal order creation error:', error);
//     return NextResponse.json(
//       { error: 'Error creating PayPal order' },
//       { status: 500 }
//     );
//   }
// } 