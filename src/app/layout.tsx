import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata } from "next";
import ReduxProvider from '@/lib/provider'
export const metadata: Metadata = {
  title: "DoubleA coffee shop",
  description: "Fresh eco-friendly drinks",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  

  return (   
    <AuthProvider>
      <html lang="en">        
        <body suppressHydrationWarning={true}>
            <div className="dark:bg-boxdark-2 w-full h-full dark:text-bodydark">
            <ReduxProvider>
              {children}
            </ReduxProvider>
            </div>
        </body>     
      </html>
    </AuthProvider>
  );
}
