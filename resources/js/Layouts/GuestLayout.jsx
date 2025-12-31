import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white">
      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg border relative">
        <Link href="/" className='absolute btn btn-circle btn-sm'>
          <i className='fas fa-arrow-left'></i>
        </Link>
        {children}
      </div>
    </div>
  );
}
