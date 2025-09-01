import React from "react";
import { TbError404 } from "react-icons/tb";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-gray-100 px-4 py-12">
      <TbError404 className="text-teal-500 text-5xl md:text-6xl mb-6 animate-bounce" />
      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900 text-center">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-7 max-w-md text-base md:text-lg text-center">
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
        <br />
        Please check the URL or return to the home page.
      </p>

      <div className="mt-10 text-xs text-gray-400 text-center w-full">
        Hotel Order System © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default NotFoundPage;
