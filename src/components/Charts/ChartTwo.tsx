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

const ChartTwo: React.FC = () => {
  const token = useAppSelector(state => state.auth.token.accessToken);
  const [bills, setBills] = useState<CompletedBill[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);
  const months = useMemo(() => ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get({
          url: clientLinks.bill.getCompletedBills,
          token,
        });
        const fetchedBills: CompletedBill[] = response.data;
        setBills(fetchedBills);
        const uniqueYears = Array.from(new Set(fetchedBills.map(bill => new Date(bill.orderDate).getFullYear().toString())));
        setYears(uniqueYears.sort());
        const latestYear = uniqueYears[uniqueYears.length - 1];
        setSelectedYear(latestYear);
        setSelectedMonth('01');
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [token]);

  const processedData = useMemo(() => {
    if (!selectedYear || !selectedMonth) return { revenueData: [], ordersData: [], categories: [], totalRevenue: 0, totalOrders: 0 };

    const dailyData: { [key: string]: { revenue: number, orders: number } } = {};
    let totalRevenue = 0;
    let totalOrders = 0;

    bills.forEach(bill => {
      const billDate = new Date(bill.orderDate);
      if (billDate.getFullYear().toString() === selectedYear && (billDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth) {
        const day = billDate.getDate().toString().padStart(2, '0');
        if (!dailyData[day]) {
          dailyData[day] = { revenue: 0, orders: 0 };
        }
        dailyData[day].revenue += bill.totalPrice;
        dailyData[day].orders += 1;
        totalRevenue += bill.totalPrice;
        totalOrders += 1;
      }
    });

    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    const categories = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const revenueData = categories.map(day => dailyData[day]?.revenue || 0);
    const ordersData = categories.map(day => dailyData[day]?.orders || 0);

    return { revenueData, ordersData, categories, totalRevenue, totalOrders };
  }, [bills, selectedYear, selectedMonth]);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [4, 4],
      curve: 'smooth'
    },
    legend: {
      tooltipHoverFormatter: function (val, opts) {
        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
      }
    },
    markers: {
      size: 6,
      hover: {
        sizeOffset: 3
      }
    },
    xaxis: {
      categories: processedData.categories,
      title: {
        text: 'Day of Month'
      }
    },
    yaxis: [
      {
        title: {
          text: "Revenue (VND)",
        },
        labels: {
          formatter: function(val) {
            return Math.round(val).toLocaleString('vi-VN') + ' VND';
          }
        }
      },
      {
        opposite: true,
        title: {
          text: "Number of Orders"
        },
        labels: {
          formatter: function(val) {
            return Math.round(val);
          }
        }
      }
    ],
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val + " (VND)"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + " orders"
            }
          }
        }
      ]
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    colors: ['#008FFB', '#00E396']
  };

  const series = [
    {
      name: "Revenue",
      type: 'line',
      data: processedData.revenueData,
    },
    {
      name: "Number of Orders",
      type: 'line',
      data: processedData.ordersData,
    }
  ];

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">
            Daily Revenue and Orders
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border rounded p-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border rounded p-1"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h6 className="text-sm font-semibold mb-2">Total Revenue ({selectedYear}-{selectedMonth})</h6>
          <p className="text-2xl font-bold">{processedData.totalRevenue.toLocaleString()} VND</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h6 className="text-sm font-semibold mb-2">Total Orders ({selectedYear}-{selectedMonth})</h6>
          <p className="text-2xl font-bold">{processedData.totalOrders.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;

