"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  form,
} from "@nextui-org/react"
import { useAppSelector } from "@/hooks/hook"
import { httpClient, clientLinks, apiLinks } from "@/utils"

interface CreateEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface EmployeeForm {
  name: string
  email: string
  password: string
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
}

interface City {
  id: string
  name: string
  districts: { id: string; name: string }[]
}

interface Region {
  id: string
  name: string
  cities: City[]
}

interface Branch {
  id: string
  name: string
}

interface SelectOption {
  id: string
  name: string
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<EmployeeForm>({
    name: "",
    email: "",
    password: "staff1234", // Default password
    phoneNumber: "",
    gender: "",
    year: new Date().getFullYear() - 25,
    month: 1,
    day: 1,
    regionId: "",
    cityId: "",
    districtId: "",
    street: "",
    branchId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<EmployeeForm>>({})
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<SelectOption[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const token = useAppSelector((state) => state.auth.token.accessToken)

  useEffect(() => {
    if (isOpen) {
      fetchInitialData()
    }
  }, [isOpen])

  const fetchInitialData = async () => {
    setIsLoadingData(true)
    try {
      const [regionsResponse, branchesResponse] = await Promise.all([
        httpClient.get({
          url: clientLinks.admin.region,
          token: token,
        }),
        httpClient.get({
          url: apiLinks.branch.index, // Update with your actual endpoint
          token: token,
        }),
      ])

      if (regionsResponse.data && regionsResponse.data.data) {
        setRegions(regionsResponse.data.data.data)
      }

      if (branchesResponse.data) {
        setBranches(branchesResponse.data.data)
      } 
    } catch (error) {
    
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleRegionChange = (value: string) => {
    const selectedRegion = regions.find((region) => region.id === value)
    const firstCity = selectedRegion?.cities?.[0] || null
    const firstDistrict = firstCity?.districts?.[0] || null

    setCities(selectedRegion?.cities || [])
    setDistricts(firstCity?.districts || [])

    setFormData({
      ...formData,
      regionId: value,
      cityId: firstCity?.id || "",
      districtId: firstDistrict?.id || "",
    })
  }

  const handleCityChange = (value: string) => {
    const selectedCity = cities.find((city) => city.id === value)
    const firstDistrict = selectedCity?.districts?.[0] || null

    setDistricts(selectedCity?.districts || [])

    setFormData({
      ...formData,
      cityId: value,
      districtId: firstDistrict?.id || "",
    })
  }

  const handleDistrictChange = (value: string) => {
    setFormData({
      ...formData,
      districtId: value,
    })
  }

  const validateForm = () => {
    const newErrors: Partial<EmployeeForm> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.regionId) newErrors.regionId = "Region is required"
    if (!formData.cityId) newErrors.cityId = "City is required"
    if (!formData.districtId) newErrors.districtId = "District is required"
    if (!formData.street.trim()) newErrors.street = "Street address is required"
    if (!formData.branchId) newErrors.branchId = "Branch is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    formData.password = "staff1234" // Set a default password if not provided
    setIsLoading(true)
    try {
      await httpClient.post({
        url: apiLinks.employee.index, // Update with your actual endpoint
        data: formData,
        token: token,
      })
      onSuccess()
      resetForm()
    } catch (error) {
      console.error("Error creating employee:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "staff1234",
      phoneNumber: "",
      gender: "",
      year: new Date().getFullYear() - 25,
      month: 1,
      day: 1,
      regionId: "",
      cityId: "",
      districtId: "",
      street: "",
      branchId: "",
    })
    setErrors({})
    setCities([])
    setDistricts([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 18 - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const genderOptions = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
    { key: "Other", label: "Other" },
  ]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Employee</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            </div>

            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              isRequired
            />

            <Select
              label="Gender"
              placeholder="Select gender"
              selectedKeys={formData.gender ? [formData.gender] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string
                setFormData({ ...formData, gender: value })
              }}
              isInvalid={!!errors.gender}
              errorMessage={errors.gender}
              isRequired
            >
              {genderOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <div className="md:col-span-2">
              <p className="text-sm font-medium mb-2">Date of Birth</p>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  label="Year"
                  selectedKeys={[formData.year.toString()]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string
                    setFormData({ ...formData, year: Number.parseInt(value) })
                  }}
                >
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year.toString()}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Month"
                  selectedKeys={[formData.month.toString()]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string
                    setFormData({ ...formData, month: Number.parseInt(value) })
                  }}
                >
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Day"
                  selectedKeys={[formData.day.toString()]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string
                    setFormData({ ...formData, day: Number.parseInt(value) })
                  }}
                >
                  {days.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-4">Contact Information</h3>
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              isRequired
            />

            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              isInvalid={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber}
              isRequired
            />

    

            {/* Address Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-4">Address Information</h3>
            </div>

            <div className="md:col-span-2">
              <Input
                label="Street Address"
                placeholder="Enter street address"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                isInvalid={!!errors.street}
                errorMessage={errors.street}
                isRequired
              />
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium mb-2">Location</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Select
                  label="Region"
                  placeholder="Select region"
                  selectedKeys={formData.regionId ? [formData.regionId] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string
                    handleRegionChange(value)
                  }}
                  isLoading={isLoadingData}
                  isInvalid={!!errors.regionId}
                  errorMessage={errors.regionId}
                  isRequired
                >
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="City"
                  placeholder="Select city"
                  selectedKeys={formData.cityId ? [formData.cityId] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string
                    handleCityChange(value)
                  }}
                  isDisabled={!formData.regionId}
                  isInvalid={!!errors.cityId}
                  errorMessage={errors.cityId}
                  isRequired
                >
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="District"
                  placeholder="Select district"
                  selectedKeys={formData.districtId ? [formData.districtId] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string
                    handleDistrictChange(value)
                  }}
                  isDisabled={!formData.cityId}
                  isInvalid={!!errors.districtId}
                  errorMessage={errors.districtId}
                  isRequired
                >
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Work Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-4">Work Information</h3>
            </div>

            <Select
              label="Branch"
              placeholder="Select branch"
              selectedKeys={formData.branchId ? [formData.branchId] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string
                setFormData({ ...formData, branchId: value })
              }}
              isLoading={isLoadingData}
              isInvalid={!!errors.branchId}
              errorMessage={errors.branchId}
              isRequired
            >
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Add Employee
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateEmployeeModal
