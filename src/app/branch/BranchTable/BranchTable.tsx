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
} from "@nextui-org/react"
import { useAppSelector } from "@/hooks/hook"
import { apiLinks, httpClient } from "@/utils"
import { MoreVertical, Edit, Trash2, Eye, MapPin, Phone } from "lucide-react"
import EditBranchModal from "./EditBranchModal"
import BranchDetailModal from "./BranchDetailModal"

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

interface BranchTableProps {
  refreshTrigger: number
  onRefresh: () => void
}

const BranchTable: React.FC<BranchTableProps> = ({ refreshTrigger, onRefresh }) => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const token = useAppSelector((state) => state.auth.token.accessToken)

  useEffect(() => {
    fetchBranches()
  }, [token, refreshTrigger])

  const fetchBranches = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await httpClient.get({
        url: apiLinks.branch.index, // Update this with your actual endpoint
        token: token,
      })
      setBranches(response.data.data)
    } catch (error) {
      console.error("Error fetching branches:", error)
      // Mock data for demonstration
  
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBranch = async (branchId: string) => {
    try {
      await httpClient.delete({
        url: `${apiLinks.branch.index}/${branchId}`, // Update with your actual endpoint
        token: token,
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting branch:", error)
    }
  }

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsDetailModalOpen(true)
  }

  const columns = [
    { key: "name", label: "Branch Name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "location", label: "Location" },
    { key: "address", label: "Street Address" },
    { key: "actions", label: "Actions" },
  ]

  const renderCell = (item: Branch, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <p className="text-bold">{item.name}</p>
          </div>
        )
      case "phoneNumber":
        return (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-500" />
            <p>{item.phoneNumber}</p>
          </div>
        )
      case "location":
        return (
          <div className="text-sm">
            <p className="font-medium">{item.cityName}</p>
            <p className="text-gray-500">{item.districtName}</p>
                        <p className="text-gray-500">{item.regionName}</p>

          </div>
        )
      case "address":
        return <p className="max-w-xs truncate">{item.street}</p>

      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <MoreVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Branch actions">
              <DropdownItem key={item.id} onPress={() => handleViewDetails(item)} startContent={<Eye size={20} />}>
                View Details
              </DropdownItem>
              <DropdownItem key={item.id} onPress={() => handleEditBranch(item)} startContent={<Edit size={20} />}>
                Edit Branch
              </DropdownItem>
              <DropdownItem
                key={item.id}
                onPress={() => handleDeleteBranch(item.id)}
                startContent={<Trash2 size={20} />}
                className="text-danger"
                color="danger"
              >
                Delete Branch
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
      <Table aria-label="Branches Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={branches}
          emptyContent={isLoading ? " " : "No branches found"}
          loadingContent={<LoadingSkeleton />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>

      {selectedBranch && (
        <>
          <EditBranchModal
            isOpen={isEditModalOpen}
            branch={selectedBranch}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedBranch(null)
            }}
            onSuccess={() => {
              setIsEditModalOpen(false)
              setSelectedBranch(null)
              onRefresh()
            }}
          />

          <BranchDetailModal
            isOpen={isDetailModalOpen}
            branch={selectedBranch}
            onClose={() => {
              setIsDetailModalOpen(false)
              setSelectedBranch(null)
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
        {[...Array(6)].map((_, cellIndex) => (
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

export default BranchTable
