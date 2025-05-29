"use client"

import type React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
  Avatar,
} from "@nextui-org/react"
import { User, Mail, Phone, MapPin, Building, Calendar, Users } from "lucide-react"

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

interface EmployeeDetailModalProps {
  isOpen: boolean
  employee: Employee
  onClose: () => void
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ isOpen, employee, onClose }) => {
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

  const formatDate = (year: number, month: number, day: number) => {
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Avatar src={employee.avatar} name={employee.name} size="lg" />
              <div>
                <h3 className="text-xl font-bold">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </div>
            </div>
            <Chip color={employee.isActive ? "success" : "danger"} variant="flat" size="sm">
              {employee.isActive ? "Active" : "Inactive"}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User size={20} className="text-blue-500" />
                <h4 className="font-semibold text-lg">Personal Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{employee.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{calculateAge(employee.year, employee.month, employee.day)} years old</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(employee.year, employee.month, employee.day)}</p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone size={20} className="text-green-500" />
                <h4 className="font-semibold text-lg">Contact Information</h4>
              </div>
              <div className="space-y-3 pl-7">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{employee.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Address Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={20} className="text-red-500" />
                <h4 className="font-semibold text-lg">Address Information</h4>
              </div>
              <div className="pl-7">
                <div className="space-y-2">
                  <p className="font-medium">{employee.street}</p>
                  <p className="text-sm text-gray-600">
                    {employee.districtName}, {employee.cityName}
                  </p>
                  <p className="text-sm text-gray-600">{employee.regionName}</p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Work Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building size={20} className="text-purple-500" />
                <h4 className="font-semibold text-lg">Work Information</h4>
              </div>
              <div className="pl-7">
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium">{employee.branchName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Users size={16} />
                  Employee Details
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">ID:</span>
                    <span className="font-medium">{employee.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Status:</span>
                    <span className="font-medium">{employee.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Branch:</span>
                    <span className="font-medium">{employee.branchName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Quick Info
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Age:</span>
                    <span className="font-medium">
                      {calculateAge(employee.year, employee.month, employee.day)} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Gender:</span>
                    <span className="font-medium">{employee.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Location:</span>
                    <span className="font-medium">{employee.cityName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EmployeeDetailModal
