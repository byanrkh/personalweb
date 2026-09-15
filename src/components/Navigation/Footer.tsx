import React from "react";

export default function Footer() {
  return (
    <footer className="w-full h-20 text-center flex items-center justify-center">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Abyan Raditya. All rights reserved.
      </p>
    </footer>
  );
}
