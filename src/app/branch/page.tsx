"use client"

import { useState } from "react"
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import BranchTable from "./BranchTable/BranchTable"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { Plus } from "lucide-react"
import CreateBranchModal from "./BranchTable/CreateBranchModal"

const BranchPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBranchCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
    setIsCreateModalOpen(false)
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Branches" />

      <Card className="h-full w-full">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <div className="mb-4 flex w-full flex-col gap-1">
            <h4 className="text-xl font-bold text-black dark:text-white">Branch Management</h4>
            <p className="text-sm text-gray-500">Manage store branches and locations</p>
          </div>
          <div className="flex gap-3">
            <Button
              color="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full"
              startContent={<Plus size={20} />}
            >
              Create Branch
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-5">
          <BranchTable refreshTrigger={refreshTrigger} onRefresh={() => setRefreshTrigger((prev) => prev + 1)} />
        </CardBody>
      </Card>

      <CreateBranchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleBranchCreated}
      />
    </DefaultLayout>
  )
}

export default BranchPage
