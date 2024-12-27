"use client"
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";
import { useAuth, } from "@/context/AuthContext";
import { useEffect } from "react";
import Chart from "@/components/Charts/page";
import { useAppSelector } from "@/hooks/hook";

export default function Home() {
  const user = useAppSelector(state => state.auth.token)
  if (!user)
    return <SignIn></SignIn>
  else
    return (
      <DefaultLayout>
        <Chart />
      </DefaultLayout>
    );
  }