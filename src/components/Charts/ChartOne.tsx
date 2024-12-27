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

const ChartOne: React.FC = () => {
  const token = useAppSelector(state => state.auth.token.accessToken);
  const [bills, setBills] = useState<CompletedBill[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get({
          url: clientLinks.bill.getCompletedBills,
          token,
        });
        const fetchedBills: CompletedBill[] = response.data;
        setBills(fetchedBills);
        const uniqueYears = ["All time", ...Array.from(new Set(fetchedBills.map(bill => new Date(bill.orderDate).getFullYear().toString())))].sort((a, b) => b.localeCompare(a));
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[0]);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [token]);

  const processedData = useMemo(() => {
    if (!selectedYear) return { revenueData: [], ordersData: [], totalRevenue: 0, totalOrders: 0 };

    const monthlyData = Array(12).fill(0).map(() => ({ revenue: 0, orders: 0 }));
    let totalRevenue = 0;
    let totalOrders = 0;

    bills.forEach(bill => {
      const billDate = new Date(bill.orderDate);
      if (selectedYear === "All time" || billDate.getFullYear().toString() === selectedYear) {
        const month = billDate.getMonth();
        monthlyData[month].revenue += bill.totalPrice;
        monthlyData[month].orders += 1;
        totalRevenue += bill.totalPrice;
        totalOrders += 1;
      }
    });

    return {
      revenueData: monthlyData.map(data => data.revenue),
      ordersData: monthlyData.map(data => data.orders),
      totalRevenue,
      totalOrders
    };
  }, [bills, selectedYear]);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: '#008FFB',
          }
        },
        title: {
          text: "Revenue (VND)",
          style: {
            color: '#008FFB',
          }
        },
        tooltip: {
          enabled: true
        }
      },
      {
        seriesName: 'Number of Orders',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396'
        },
        labels: {
          style: {
            colors: '#00E396',
          }
        },
        title: {
          text: "Number of Orders",
          style: {
            color: '#00E396',
          }
        },
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topLeft',
        offsetY: 30,
        offsetX: 60
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    }
  };

  const series = [
    {
      name: "Revenue",
      type: 'column',
      data: processedData.revenueData,
    },
    {
      name: "Number of Orders",
      type: 'column',
      data: processedData.ordersData,
    }
  ];

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">
            Monthly Revenue and Orders {selectedYear !== "All time" ? `(${selectedYear})` : ''}
          </h4>
        </div>
        <div className="flex items-center">
          <label htmlFor="yearSelect" className="mr-2">Select Year:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={handleYearChange}
            className="border rounded p-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h6 className="text-sm font-semibold mb-2">Total Revenue {selectedYear !== "All time" ? `(${selectedYear})` : ''}</h6>
          <p className="text-2xl font-bold">{processedData.totalRevenue.toLocaleString()} VND</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h6 className="text-sm font-semibold mb-2">Total Orders {selectedYear !== "All time" ? `(${selectedYear})` : ''}</h6>
          <p className="text-2xl font-bold">{processedData.totalOrders.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;

