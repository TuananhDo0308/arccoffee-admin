"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProcessingOrderTable from "./ProcessingOrder/Process";
import CompletedOrderTable from "./CompletedOrder/completedOrder";

const OrderPage = () => {
  const [activeSection, setActiveSection] = useState<string>("process");

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <div className="mb-4 flex w-full flex-col gap-1">
            <h4 className="text-xl font-bold text-black dark:text-white">
              Order Management
            </h4>
            <p className="text-sm text-gray-500">Manage and track orders</p>
          </div>
          <div className="flex gap-3">
            <Button
              color={activeSection === "process" ? "primary" : "default"}
              onClick={() => setActiveSection("process")}
              className="rounded-full"
            >
              Processing Orders
            </Button>
            <Button
              color={activeSection === "complete" ? "primary" : "default"}
              onClick={() => setActiveSection("complete")}
              className="rounded-full"
            >
              Completed Orders
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-5">
          {activeSection === "process" && <ProcessingOrderTable />}
          {activeSection === "complete" && <CompletedOrderTable />}
        </CardBody>
      </Card>
    </DefaultLayout>
  );
};

export default OrderPage;
