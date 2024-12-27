"use client"
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";
import { useAuth, } from "@/context/AuthContext";
import { useEffect } from "react";
import Chart from "@/components/Charts/page";
import { useAppSelector } from "@/hooks/hook";

export default function Home() {

    return (
      <DefaultLayout>
        <Chart />
      </DefaultLayout>
    );
  }