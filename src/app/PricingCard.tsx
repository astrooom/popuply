import { Check, CheckCheck } from "lucide-react";

export function PricingCard() {
  return (
    <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-green-500 text-white text-xs font-bold rounded-full p-2">
        Lifetime Access
      </div>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
        One and Done <CheckCheck className="text-green-500" />
      </h2>
      <div className="mb-4">
        <span className="text-4xl font-bold">$29</span>
        <span className="text-gray-500 dark:text-gray-400"> One-time</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Pay once - own forever. No recurring fees!
      </p>
      <button className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
        Get Started Now
      </button>
      <hr className="my-6" />
      <ul className="space-y-3">
        {["Unlimited Sites", "Unlimited Popups", "No Coding Required", "24/7 Support", "Regular Updates"].map(
          (benefit) => (
            <li key={benefit} className="flex items-center space-x-3">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span>{benefit}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}