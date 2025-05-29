"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import VoucherTable from "./VoucherTable/VoucherTable";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Plus } from 'lucide-react';
import CreateVoucherModal from "./VoucherTable/CreateVoucherModal";

const VoucherPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVoucherCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsCreateModalOpen(false);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Vouchers" />

      <Card className="h-full w-full">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <div className="mb-4 flex w-full flex-col gap-1">
            <h4 className="text-xl font-bold text-black dark:text-white">
              Voucher Management
            </h4>
            <p className="text-sm text-gray-500">Manage discount vouchers and promotions</p>
          </div>
          <div className="flex gap-3">
            <Button
              color="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full"
              startContent={<Plus size={20} />}
            >
              Create Voucher
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-5">
          <VoucherTable refreshTrigger={refreshTrigger} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />
        </CardBody>
      </Card>

      <CreateVoucherModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleVoucherCreated}
      />
    </DefaultLayout>
  );
};

export default VoucherPage;
