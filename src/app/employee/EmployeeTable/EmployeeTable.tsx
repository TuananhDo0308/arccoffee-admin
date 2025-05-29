"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
  Chip,
  Avatar,
} from "@nextui-org/react"
import { useAppSelector } from "@/hooks/hook"
import { apiLinks, httpClient } from "@/utils"
import { MoreVertical, Edit, Trash2, Eye, Mail, Phone, MapPin, Building } from "lucide-react"
import EditEmployeeModal from "./EditEmployeeModal"
import EmployeeDetailModal from "./EmployeeDetailModal"

interface Employee {
  id: string
  name: string
  email: string
  phoneNumber: string
  gender: string
  year: number
  month: number
  day: number
  regionId: string
  cityId: string
  districtId: string
  street: string
  branchId: string
  regionName?: string
  cityName?: string
  districtName?: string
  branchName?: string
  isActive?: boolean
  avatar?: string
}

interface EmployeeTableProps {
  refreshTrigger: number
  onRefresh: () => void
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ refreshTrigger, onRefresh }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const token = useAppSelector((state) => state.auth.token.accessToken)

  useEffect(() => {
    fetchEmployees()
  }, [token, refreshTrigger])

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await httpClient.get({
        url: apiLinks.employee.list, // Update this with your actual endpoint
        token: token,
      })
      setEmployees(response.data.data)
    } catch (error) {
      console.error("Error fetching employees:", error)

    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await httpClient.delete({
        url: `${apiLinks.employee.index}/${employeeId}`, // Update with your actual endpoint
        token: token,
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting employee:", error)
    }
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailModalOpen(true)
  }

  const calculateAge = (year: number, month: number, day: number) => {
    const today = new Date()
    const birthDate = new Date(year, month - 1, day)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const columns = [
    { key: "employee", label: "Employee" },
    { key: "contact", label: "Contact" },
    { key: "personal", label: "Personal Info" },
    { key: "branch", label: "Branch" },
    { key: "location", label: "Location" },
  ]

  const renderCell = (item: Employee, columnKey: React.Key) => {
    switch (columnKey) {
      case "employee":
        return (
          <div className="flex items-center gap-3">
            <Avatar src={item.avatar} name={item.name} size="sm" className="flex-shrink-0" />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.email}</p>
            </div>
          </div>
        )
      case "contact":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-500" />
              <p className="text-sm">{item.phoneNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-500" />
              <p className="text-sm truncate max-w-[150px]">{item.email}</p>
            </div>
          </div>
        )
      case "personal":
        return (
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Gender:</span> {item.gender}
            </p>
            <p className="text-sm">
              <span className="font-medium">Age:</span> {calculateAge(item.year, item.month, item.day)}
            </p>
          </div>
        )
      case "branch":
        return (
          <div className="flex items-center gap-2">
            <Building size={16} className="text-gray-500" />
            <p className="font-medium">{item.branchName}</p>
          </div>
        )
      case "location":
        return (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <div className="text-sm">
              <p className="font-medium">{item.cityName}</p>
              <p className="text-gray-500">{item.districtName}</p>
            </div>
          </div>
        )
      case "status":
        return (
          <Chip color={item.isActive ? "success" : "danger"} variant="flat" size="sm">
            {item.isActive ? "Active" : "Inactive"}
          </Chip>
        )
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <MoreVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Employee actions">
              <DropdownItem onPress={() => handleViewDetails(item)} startContent={<Eye size={20} />}>
                View Details
              </DropdownItem>
              <DropdownItem onPress={() => handleEditEmployee(item)} startContent={<Edit size={20} />}>
                Edit Employee
              </DropdownItem>
              <DropdownItem
                onPress={() => handleDeleteEmployee(item.id)}
                startContent={<Trash2 size={20} />}
                className="text-danger"
                color="danger"
              >
                Delete Employee
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )
      default:
        return <p>N/A</p>
    }
  }

  return (
    <>
      <Table aria-label="Employees Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={employees}
          emptyContent={isLoading ? " " : "No employees found"}
          loadingContent={<LoadingSkeleton />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>

      {selectedEmployee && (
        <>
          <EditEmployeeModal
            isOpen={isEditModalOpen}
            employee={selectedEmployee}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedEmployee(null)
            }}
            onSuccess={() => {
              setIsEditModalOpen(false)
              setSelectedEmployee(null)
              onRefresh()
            }}
          />

          <EmployeeDetailModal
            isOpen={isDetailModalOpen}
            employee={selectedEmployee}
            onClose={() => {
              setIsDetailModalOpen(false)
              setSelectedEmployee(null)
            }}
          />
        </>
      )}
    </>
  )
}

const LoadingSkeleton = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(7)].map((_, cellIndex) => (
          <TableCell key={cellIndex}>
            <Skeleton className="w-full">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

export default EmployeeTable
