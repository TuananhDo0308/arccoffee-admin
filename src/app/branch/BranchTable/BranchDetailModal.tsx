"use client"

import type React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Divider } from "@nextui-org/react"
import { MapPin, Phone, Building } from "lucide-react"

interface Branch {
  id: string
  name: string
  phoneNumber: string
  regionId: string
  cityId: string
  districtId: string
  street: string
  regionName?: string
  cityName?: string
  districtName?: string
  isActive?: boolean
}

interface BranchDetailModalProps {
  isOpen: boolean
  branch: Branch
  onClose: () => void
}

const BranchDetailModal: React.FC<BranchDetailModalProps> = ({ isOpen, branch, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Building size={24} />
              <span>Branch Details</span>
            </div>
            <Chip color={branch.isActive ? "success" : "danger"} variant="flat" size="sm">
              {branch.isActive ? "Active" : "Inactive"}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Branch Name</p>
              <p className="font-bold text-lg">{branch.name}</p>
            </div>

            <Divider />

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{branch.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Address</p>
                  <div className="space-y-1">
                    <p className="font-medium">{branch.street}</p>
                    <p className="text-sm text-gray-600">
                      {branch.districtName}, {branch.cityName}
                    </p>
                    <p className="text-sm text-gray-600">{branch.regionName}</p>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Location Information</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Region:</span>
                  <span className="font-medium">{branch.regionName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">City:</span>
                  <span className="font-medium">{branch.cityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">District:</span>
                  <span className="font-medium">{branch.districtName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Street:</span>
                  <span className="font-medium">{branch.street}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Contact Information</h4>
              <div className="text-sm">
                <p className="text-green-700 dark:text-green-300">
                  Phone: <span className="font-medium">{branch.phoneNumber}</span>
                </p>
                <p className="text-green-700 dark:text-green-300 mt-1">
                  Status: <span className="font-medium">{branch.isActive ? "Active" : "Inactive"}</span>
                </p>
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

export default BranchDetailModal
