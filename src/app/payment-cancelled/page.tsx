import { ArrowLeft, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from "@/components/ui/Button";
import { Navbar } from '../Navbar';

export default function PaymentCancelledPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="pt-32 pb-12">
          <div className="bg-gradient-to-br from-red-50/20 to-orange-50/20 dark:from-gray-900/10 dark:to-red-900/10 dark:border px-8 py-16 rounded-xl">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Payment <span className="inline bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Cancelled</span>
                </h1>
                <p className="text-xl text-foreground md:w-3/4 mx-auto">
                  We&apos;re sorry, but your payment was cancelled. Don&apos;t worry, you haven&apos;t been charged. If you encountered any issues, please try again or contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/" className={buttonVariants({ variant: "default" })}>
                    <ArrowLeft className="mr-2 h-5 w-5" /> Try Again
                  </Link>
                  <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                    <LifeBuoy className="mr-2 h-5 w-5" /> Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

