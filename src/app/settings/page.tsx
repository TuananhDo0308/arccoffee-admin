"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { useAppSelector } from "@/hooks/hook"
import { apiLinks, httpClient } from "@/utils"

interface UserData {
  role: string
  branchId: string
  branchName: string
  regionName: string
  cityName: string
  districtName: string
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
}

interface UserDataSubmit {
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

interface District {
  id: string
  name: string
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

const UserProfile = () => {
  const token = useAppSelector((state) => state?.auth?.token?.accessToken)
  const [formData, setFormData] = useState<UserData>({
    role: "",
    branchId: "",
    branchName: "",
    regionName: "",
    cityName: "",
    districtName: "",
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    year: 0,
    month: 0,
    day: 0,
    regionId: "",
    cityId: "",
    districtId: "",
    street: "",
  })

  const [formDataTemp, setFormDataTemp] = useState<UserData>({
    role: "",
    branchId: "",
    branchName: "",
    regionName: "",
    cityName: "",
    districtName: "",
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    year: 0,
    month: 0,
    day: 0,
    regionId: "",
    cityId: "",
    districtId: "",
    street: "",
  })

  const [password, setPassword] = useState("")
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [isEditable, setIsEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Mock user data - replace with your actual API call
        const userData: UserData = {
          role: "Staff",
          branchId: "72199e6c-db33-4671-1faa-08dd9e0b0fb5",
          branchName: "1e122",
          regionName: "Miền Nam",
          cityName: "Đồng Nai",
          districtName: "Trảng Bom",
          id: "b86110e4-fd27-4bcb-8f84-a527c151438f",
          name: "Tuananh Do",
          email: "admi1n@gmail.com",
          phoneNumber: "0909233244",
          gender: "Female",
          year: 2000,
          month: 1,
          day: 1,
          regionId: "Nam",
          cityId: "acd51ba8-d6e3-4110-831e-5147f8fe2c96",
          districtId: "05e87ab6-1238-412d-9d93-88902310ee89",
          street: "41 TVH",
        }

        // Mock regions data - replace with your actual API call
        const regionsData: Region[] = [
          {
            id: "Nam",
            name: "Miền Nam",
            cities: [
              {
                id: "acd51ba8-d6e3-4110-831e-5147f8fe2c96",
                name: "Đồng Nai",
                districts: [
                  {
                    id: "05e87ab6-1238-412d-9d93-88902310ee89",
                    name: "Trảng Bom",
                  },
                ],
              },
            ],
          },
        ]

        setFormData(userData)
        setRegions(regionsData)

        // Set cities and districts based on current user data
        const userRegion = regionsData.find((region) => region.id === userData.regionId)
        setCities(userRegion?.cities || [])

        const userCity = userRegion?.cities?.find((city) => city.id === userData.cityId)
        setDistricts(userCity?.districts || [])
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const updateUserData = async (dataSubmit: UserDataSubmit) => {
    try {
      setIsLoading(true)

      // Replace with your actual API endpoint
      const response = await httpClient.put({
        url: apiLinks.employee.index, // Update with your actual endpoint
        data: dataSubmit,
        token: token,
      })

      console.log("User updated successfully:", response)

      // Update local state with new data
      setFormData((prev) => ({
        ...prev,
        ...dataSubmit,
      }))
    } catch (err) {
      console.error("Error updating user data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleModifyClick = () => {
    setFormDataTemp(formData)
    setIsEditable(true)
    setPassword("") // Reset password field
  }

  const handleCancelClick = () => {
    setFormData(formDataTemp)
    setIsEditable(false)
    setPassword("")

    // Reset location dropdowns
    const adminRegion = regions.find((region) => region.id === formDataTemp.regionId)
    setCities(adminRegion?.cities || [])

    const adminCity = adminRegion?.cities?.find((city) => city.id === formDataTemp.cityId)
    setDistricts(adminCity?.districts || [])
  }

  const handleSaveClick = () => {
    const submitData: UserDataSubmit = {
      name: formData.name,
      email: formData.email,
      password: password,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      year: formData.year,
      month: formData.month,
      day: formData.day,
      regionId: formData.regionId,
      cityId: formData.cityId,
      districtId: formData.districtId,
      street: formData.street,
      branchId: formData.branchId,
    }

    updateUserData(submitData)
    setIsEditable(false)
    setPassword("")
  }

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const selectedRegion = regions.find((region) => region.id === value)
    const city = selectedRegion?.cities?.[0] || null
    const district = city?.districts?.[0] || null

    setCities(selectedRegion?.cities || [])
    setDistricts(city?.districts || [])
    setFormData((prevState) => ({
      ...prevState,
      regionId: value,
      cityId: city?.id || "",
      districtId: district?.id || "",
    }))
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const selectedCity = cities.find((city) => city.id === value)
    const district = selectedCity?.districts?.[0] || null

    setDistricts(selectedCity?.districts || [])
    setFormData((prevState) => ({
      ...prevState,
      cityId: value,
      districtId: district?.id || "",
    }))
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      districtId: value,
    }))
  }

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="User Profile" />
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="User Profile" />
        <div className="flex justify-between gap-4 flex-wrap">
          {/* Left container */}
          <div className="flex-1">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
              </div>
              <div className="p-7">
                <form>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="fullName">
                        Full Name
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="name"
                        id="fullName"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="emailAddress">
                      Email Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="email"
                      id="emailAddress"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                    />
                  </div>

                  {isEditable && (
                    <div className="mb-5.5">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="password">
                        Password
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password (leave blank to keep current)"
                      />
                    </div>
                  )}

                  <div className="mb-5.5 flex justify-wrap gap-5.5">
                    <div className="flex-1">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="gender">
                        Gender
                      </label>
                      <select
                        className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="role">
                        Role
                      </label>
                      <input
                      disabled
                        className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="dateOfBirth">
                      Date of Birth
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={`${formData.year}-${formData.month?.toString().padStart(2, "0")}-${formData.day?.toString().padStart(2, "0")}`}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split("-")
                        setFormData((prev) => ({
                          ...prev,
                          year: Number.parseInt(year),
                          month: Number.parseInt(month),
                          day: Number.parseInt(day),
                        }))
                      }}
                      disabled={!isEditable}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right container */}
          <div className="flex-1">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Location Information</h3>
              </div>
              <div className="p-7">
                <form>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="branch">
                      Branch
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="branch"
                      id="branch"
                      value={formData.branchName}
                      readOnly
                    />
                  </div>

                  <div className="mb-5.5 flex flex-wrap gap-5.5">
                    <div className="flex-1">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="region">
                        Region
                      </label>
                      <select
                        name="regionId"
                        value={formData.regionId}
                        onChange={handleRegionChange}
                        disabled={!isEditable}
                        className="w-full rounded border border-stroke py-3 px-5 text-black bg-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          Select Region
                        </option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="city">
                        City
                      </label>
                      <select
                        name="cityId"
                        value={formData.cityId}
                        onChange={handleCityChange}
                        disabled={!isEditable || !formData.regionId}
                        className="w-full rounded border border-stroke py-3 px-5 text-black bg-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          Select City
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="district">
                      District
                    </label>
                    <select
                      name="districtId"
                      value={formData.districtId}
                      onChange={handleDistrictChange}
                      disabled={!isEditable || !formData.cityId}
                      className="w-full rounded border border-stroke py-3 px-5 text-black bg-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="" disabled>
                        {formData.cityId ? "Select District" : "Select a City first"}
                      </option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="street">
                      Street Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="street"
                      id="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isEditable && (
          <div className="pt-5 w-full flex flex-row-reverse">
            <button
              className="flex justify-center rounded bg-green-400 border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              type="button"
              onClick={handleModifyClick}
            >
              Modify
            </button>
          </div>
        )}

        {isEditable && (
          <div className="flex justify-end gap-4.5 pt-5">
            <button
              className="flex justify-center rounded bg-slate-400 border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              type="button"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
              type="button"
              onClick={handleSaveClick}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}

export default UserProfile
