import React from "react"
import { Navbar } from "../Navbar"
import { Mail } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Popuply | Contact",
  description: "Contact us for any questions or concerns",
}

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-xl mb-8">We&apos;re here to help! Get in touch with us for any questions or concerns.</p>

          <div className="grid md:grid-cols-1 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <Mail className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Email</h2>
              <p className="text-xl">
                <a href="mailto:contact@buddleja.co" className="text-blue-500 hover:underline">
                  contact@buddleja.co
                </a>
              </p>
            </div>
          </div>

          <div className="p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">What are your business hours?</h3>
              <p className="mb-4">I&apos;m available Monday to Friday, 9 AM to 5 PM (CET).</p>

              <h3 className="text-xl font-semibold mb-2">How quickly can I expect a response?</h3>
              <p className="mb-4">Respones are handled within 24 hours.</p>

              <h3 className="text-xl font-semibold mb-2">Do you offer support on weekends?</h3>
              <p>While I like to have weekends off, I monitor urgent requests and will respond to critical issues.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
