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
} from "@nextui-org/react"
import { useAppSelector } from "@/hooks/hook"
import { httpClient, clientLinks, apiLinks } from "@/utils"

interface CreateBranchModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface BranchForm {
  name: string
  phoneNumber: string
  regionId: string
  cityId: string
  districtId: string
  street: string
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

interface SelectOption {
  id: string
  name: string
}

const CreateBranchModal: React.FC<CreateBranchModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<BranchForm>({
    name: "",
    phoneNumber: "",
    regionId: "",
    cityId: "",
    districtId: "",
    street: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<BranchForm>>({})
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<SelectOption[]>([])
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const token = useAppSelector((state) => state.auth.token.accessToken)

  useEffect(() => {
    if (isOpen) {
      fetchRegions()
    }
  }, [isOpen])

  const fetchRegions = async () => {
    setIsLoadingLocation(true)
    try {
      const response = await httpClient.get({
        url: clientLinks.admin.region,
        token: token,
      })
      if (response.data && response.data.data) {
        setRegions(response.data.data.data)
      }
    } catch (error) {
      console.error("Error fetching regions:", error)

    } finally {
      setIsLoadingLocation(false)
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
    const newErrors: Partial<BranchForm> = {}

    if (!formData.name.trim()) newErrors.name = "Branch name is required"
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits"
    if (!formData.regionId) newErrors.regionId = "Region is required"
    if (!formData.cityId) newErrors.cityId = "City is required"
    if (!formData.districtId) newErrors.districtId = "District is required"
    if (!formData.street.trim()) newErrors.street = "Street address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await httpClient.post({
        url: apiLinks.branch.index, // Update with your actual endpoint
        data: formData,
        token: token,
      })
      onSuccess()
      resetForm()
    } catch (error) {
      console.error("Error creating branch:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      regionId: "",
      cityId: "",
      districtId: "",
      street: "",
    })
    setErrors({})
    setCities([])
    setDistricts([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Create New Branch</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Branch Name"
              placeholder="Enter branch name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
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
                  isLoading={isLoadingLocation}
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
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Create Branch
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateBranchModal
