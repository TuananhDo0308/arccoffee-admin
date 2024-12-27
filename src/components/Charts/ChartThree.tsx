"use client";

import { ApexOptions } from "apexcharts";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/hooks/hook";
import { clientLinks, httpClient } from "@/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CompletedBill {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  customerId: string;
  customerName: string;
  shippingMethodId: string;
  status: string;
  orderDate: string;
  paymentId: string;
  voucherId: string | null;
  totalPrice: number;
}

interface TopProduct {
  name: string;
  revenue: number;
}

const ChartThree: React.FC = () => {
  const token = useAppSelector(state => state.auth.token.accessToken);
  const [bills, setBills] = useState<CompletedBill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get({
          url: clientLinks.bill.getCompletedBills,
          token,
        });
        const fetchedBills: CompletedBill[] = response.data;
        setBills(fetchedBills);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [token]);

  const topProducts = useMemo(() => {
    const productRevenue: { [key: string]: number } = {};

    bills.forEach(bill => {
      bill.items.forEach(item => {
        if (!productRevenue[item.name]) {
          productRevenue[item.name] = 0;
        }
        productRevenue[item.name] += item.price * item.quantity;
      });
    });

    return Object.entries(productRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));
  }, [bills]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: topProducts.map(product => product.name),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString() + " VND"
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex].toLocaleString() + " VND"
      }
    }
  };

  const series = topProducts.map(product => product.revenue);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">
            Top 5 Best-Selling Products
          </h4>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          <div id="chartThree" className="mx-auto w-full">
            <ReactApexChart
              options={options}
              series={series}
              type="pie"
              height={400}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.revenue.toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;

