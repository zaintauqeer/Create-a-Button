import { protectServer } from "@/features/auth/utils";

import { Banner } from "./banner";
import { ProjectsSection } from "./projects-section";
import { TemplatesSection } from "./templates-section";
import { ArrowRight, Check, Star } from 'lucide-react'
import Link from "next/link";
import TemplateButton from "./templateButton";
import { buttonVariants } from '@/components/ui/button'

export default async function Home() {
  // await protectServer();

  return (
    <div className='bg-slate-50 grainy-light'>
        <section>
          <div className='h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 pb-24 pt-10 lg:grid lg:grid-cols-2 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52'>
            <div className='col-span-1 px-6 lg:px-0 lg:pt-4'>
              <div className='relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start'>
                <div className='absolute w-28 left-0 -top-20 hidden lg:block'>
                  {/* i forgot this div right here in the video, it's purely visual gradient and looks nice */}
                  <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-28' />
                  {/* <img src='/snake-1.png' className='w-full' /> */}
                </div>
                <h1 className='relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl'>
                  Your Image on a
                  <span className='bg-primary px-2 text-white'>Custom</span>
                  Button
                </h1>
                <p className='mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap'>
                  At CreateAButton, you can design your very own, unique button to showcase your style or message. Protect and express your individuality with our custom buttons.
                </p>

                <ul className='my-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start'>
                  <div className='space-y-2'>
                    <li className='flex gap-1.5 items-center text-left'>
                      <Check className='h-5 w-5 shrink-0 text-primary' />
                      High-quality, durable material
                    </li>
                    <li className='flex gap-1.5 items-center text-left'>
                      <Check className='h-5 w-5 shrink-0 text-primary' />
                      5-year design guarantee
                    </li>
                    <li className='flex gap-1.5 items-center text-left'>
                      <Check className='h-5 w-5 shrink-0 text-primary' />
                      Available in various sizes and styles
                    </li>
                  </div>
                </ul>
                <Link
                    href='/editor'
                    className={buttonVariants({
                        size: 'lg',
                        className: 'flex items-center gap-1 text-xl',
                    })}>
                    Create Now
                </Link>

                <div className='mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5'>
                  <div className='flex -space-x-4'>
                    <img
                      className='inline-block h-10 w-10 rounded-full ring-2 ring-slate-100'
                      src='/users/user-1.png'
                      alt='user image'
                    />
                    <img
                      className='inline-block h-10 w-10 rounded-full ring-2 ring-slate-100'
                      src='/users/user-2.png'
                      alt='user image'
                    />
                    <img
                      className='inline-block h-10 w-10 rounded-full ring-2 ring-slate-100'
                      src='/users/user-3.png'
                      alt='user image'
                    />
                    <img
                      className='inline-block h-10 w-10 rounded-full ring-2 ring-slate-100'
                      src='/users/user-4.jpg'
                      alt='user image'
                    />
                    <img
                      className='inline-block object-cover h-10 w-10 rounded-full ring-2 ring-slate-100'
                      src='/users/user-5.jpg'
                      alt='user image'
                    />
                  </div>

                  <div className='flex flex-col justify-between items-center sm:items-start'>
                    <div className='flex gap-0.5'>
                      <Star className='h-4 w-4 text-primary fill-primary' />
                      <Star className='h-4 w-4 text-primary fill-primary' />
                      <Star className='h-4 w-4 text-primary fill-primary' />
                      <Star className='h-4 w-4 text-primary fill-primary' />
                      <Star className='h-4 w-4 text-primary fill-primary' />
                    </div>

                    <p>
                      <span className='font-semibold'>1.250</span> happy customers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit'>
              <div className='relative md:max-w-80 w-full'>
                <img
                  src='/your-image.png'
                  className='absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block'
                />
                <img
                  src='/line.png'
                  className='absolute w-20 -left-6 -bottom-6 select-none'
                />
                <TemplateButton className='w-full' imgSrc='/testimonials/1.jpg' />
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

