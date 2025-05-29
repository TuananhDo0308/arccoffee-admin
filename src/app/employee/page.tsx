"use client"

import { useState } from "react"
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import EmployeeTable from "./EmployeeTable/EmployeeTable"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { Plus } from "lucide-react"
import CreateEmployeeModal from "./EmployeeTable/CreateEmployeeModal"

const EmployeePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEmployeeCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
    setIsCreateModalOpen(false)
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Employees" />

      <Card className="h-full w-full">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <div className="mb-4 flex w-full flex-col gap-1">
            <h4 className="text-xl font-bold text-black dark:text-white">Employee Management</h4>
            <p className="text-sm text-gray-500">Manage staff members and their information</p>
          </div>
          <div className="flex gap-3">
            <Button
              color="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full"
              startContent={<Plus size={20} />}
            >
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-5">
          <EmployeeTable refreshTrigger={refreshTrigger} onRefresh={() => setRefreshTrigger((prev) => prev + 1)} />
        </CardBody>
      </Card>

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleEmployeeCreated}
      />
    </DefaultLayout>
  )
}

export default EmployeePage
