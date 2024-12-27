"use client"
import React, { useEffect, useState } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/context/AuthContext";
import { IMG_URL } from "@/API/LinkAPI";
import { updateAdmin } from "@/API/adminAPI"; // Adjust this import based on your file structure
import { useAppSelector } from "@/hooks/hook";
import { clientLinks, httpClient } from "@/utils";

interface AdminData {
  id: string | never,
  name: string,
  username: string,
  email: string,
  password: string,
  phoneNumber: string,
  gender: string,
  year: number,
  month: number,
  day: number,
  roleId: string,
  branchId: string,
  branchName: string,
  regionId: string,
  regionName: string,
  cityId: string,
  cityName: string,
  districtId: string,
  districtName: string,
  street: string,
}

interface AdminDataSubmit {
  name: string,
  username: string,
  email: string,
  password: string,
  phoneNumber: string,
  gender: string,
  year: number,
  month: number,
  day: number,
  regionId: string,
  cityId: string,
  districtId: string,
  street: string,
  roleId: string,
  branchId: string
}

interface District {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  districts: { id: string; name: string }[];
}

interface Region {
  id: string;
  name: string;
  cities: City[];
}

const Settings = () => {
  const token = useAppSelector(state => state.auth.token.accessToken)
  const [formData, setFormData] = useState<AdminData>({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    year: 0,
    month: 0,
    day: 0,
    roleId: "",
    branchId: "",
    branchName: "",
    regionId: "",
    regionName: "",
    cityId: "",
    cityName: "",
    districtId: "",
    districtName: "",
    street: "",
  });
  let [formDataTemp, setFormDataTemp] = useState<AdminData>({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    year: 0,
    month: 0,
    day: 0,
    roleId: "",
    branchId: "",
    branchName: "",
    regionId: "",
    regionName: "",
    cityId: "",
    cityName: "",
    districtId: "",
    districtName: "",
    street: "",
  });
 
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [regionError, setRegionError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin admin
        const adminResponse = await httpClient.get({
          url: clientLinks.admin.getAdmin,
          token: token,
        });

        // Lấy danh sách regions
        const regionsResponse = await httpClient.get({
          url: clientLinks.admin.region,
        });

        // Cập nhật state
        setFormData(adminResponse.data);
        setRegions(regionsResponse.data.data);

        // Xử lý cities và districts dựa trên region và city hiện tại
        const adminRegion = regionsResponse.data.data.find(
          (region: Region) => region.id === adminResponse.data.regionId
        );
        setCities(adminRegion?.cities || []);

        const adminCity = adminRegion?.cities?.find(
          (city: City) => city.id === adminResponse.data.cityId
        );
        setDistricts(adminCity?.districts || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, [token]); // Thêm dependencies để kiểm soát khi nào useEffect được gọi

  console.log()
  const updateAdminData = async (dataSubmit: AdminDataSubmit) => {
    try {
      // Gọi API để lấy dữ liệu admin
      const response = await httpClient.put({
        url: clientLinks.admin.updateAdmin,
        data: dataSubmit, // Truyền dữ liệu admin vào body
        token: token
      });

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleModifyClick = () => {
    setFormDataTemp(formData);
    console.log("Before:", isEditable);
    setIsEditable(true);
    console.log("After:", isEditable);
  };

  const handleCancelClick = () => {
    setFormData(formDataTemp);
    setIsEditable(false);
    console.log("formData: ", formData)

    // Tìm region tương ứng từ formDataTemp
    const adminRegion = regions.find(
      (region: Region) => region.id === formDataTemp.regionId
    );
    setCities(adminRegion?.cities || []);

    // Tìm city tương ứng từ formDataTemp
    const adminCity = adminRegion?.cities?.find(
      (city: City) => city.id === formDataTemp.cityId
    );
    setDistricts(adminCity?.districts || []);
  };

  const handleSaveClick = () => {
    const submitData: AdminDataSubmit = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      year: formData.year,
      month: formData.month,
      day: formData.day,
      regionId: formData.regionId,
      cityId: formData.cityId,
      districtId: formData.districtId,
      street: formData.street,
      roleId: formData.roleId,
      branchId: formData.branchId,
    };

    updateAdminData(submitData);
    setIsEditable(false);
  };

  // Xử lý sự kiện thay đổi `region`
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const selectedRegion = regions.find(region => region.id === value);
    const city = selectedRegion?.cities?.[0] || null
    const district = city?.districts?.[0] || null
    console.log("formData: ", formData)

    setCities(selectedRegion?.cities || [])
    setDistricts(city?.districts || [])
    setFormData(prevState => ({
      ...prevState,
      regionId: value,
      cityId: city?.id || '',
      districtId: district?.id || '',
    }))
  };

  // Xử lý sự kiện thay đổi `city`
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const selectedCity = cities.find(city => city.id === value);

    setFormData(prevState => ({
      ...prevState,
      cityId: value,
      cityName: selectedCity?.name || "",
    }));
  };

  // Xử lý sự kiện thay đổi `district`
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const selectedDistrict = districts.find(district => district.id === value);

    setFormData(prevState => ({
      ...prevState,
      districtId: value,
      districtName: selectedDistrict?.name || "",
    }));
  };


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

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
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="fullName"
                          >
                            Full Name
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="name"
                            id="fullName"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditable} // Disable input if not editable
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
                            disabled={!isEditable} // Disable input if not editable
                          />
                        </div>
                      </div>

                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress"
                        >
                          Email Address
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="email"
                          name="email"
                          id="emailAddress"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditable} // Disable input if not editable
                        />
                      </div>

                      <div className="mb-5.5 flex justify-wrap gap-5.5">
                        <div className="flex-1">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="address"
                          >
                            Gender
                          </label>

                          <select
                            className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            name="gender"
                            id="gender" // Đổi từ "address" thành "gender" nếu cần
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditable} // Disable select if not editable
                          >
                            <option value="" disabled>
                             Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>

                        </div>
                        <div className="flex-1">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="address"
                          >
                            Role
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="roleId"
                            id="address"
                            value={formData.roleId}
                            onChange={handleInputChange}
                            // disabled={!isEditable} // Disable input if not editable
                            readOnly="true" // Chỉ xem, không sửa
                          />
                        </div>
                      </div>

                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="dateOfBirth"
                        >
                          Date of Birth
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={`${formData.year}-${formData.month?.toString().padStart(2, '0')}-${formData.day?.toString().padStart(2, '0')}`}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-');
                            handleInputChange({ target: { name: 'year', value: parseInt(year) } });
                            handleInputChange({ target: { name: 'month', value: parseInt(month) } });
                            handleInputChange({ target: { name: 'day', value: parseInt(day) } });
                          }}
                          disabled={!isEditable} // Disable input if not editable
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right container */}
              <div className=" flex-1">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
                  </div>
                  <div className="p-7">
                    <form>
                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="branch"
                        >
                          Branch
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="branch"
                          id="branch"
                          value={formData.branchName}
                          onChange={handleInputChange}
                          readOnly
                        />
                      </div>

                      <div className="mb-5.5 flex flex-wrap gap-5.5">
                        <div className="flex-1">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="region"
                          >
                            Region
                          </label>
                          {/* Region Select */}
                          <select
                            name="regionId"
                            value={formData.regionId}
                            onChange={handleRegionChange}
                            disabled={!isEditable}
                            className={`w-full rounded border py-3 px-5 text-black bg-gray 
                             focus:border-primary focus-visible:outline-none
                             dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${regionError ? "border-red-500" : "border-stroke"
                              }`}
                          >

                            <option value="" disabled>
                              Select Region
                            </option>
                            {regions.map(region => (
                              <option key={region.id} value={region.id}>
                                {region.name}
                              </option>
                            ))}
                          </select>
                          {regionError && <p className="text-red-500 text-sm mt-1">{regionError}</p>}
                        </div>
                        <div className="flex-1">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="city"
                          >
                            City Name
                          </label>
                          {/* City Select */}
                          <select
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleCityChange}
                            disabled={!isEditable || !formData.regionId}
                            className="w-full rounded border py-3 px-5 text-black bg-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          >
                            <option value="" disabled>
                              Select City
                            </option>
                            {cities.map(city => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="district"
                        >
                          District
                        </label>
                        {/* District Select */}
                        <select
                          name="districtId"
                          value={formData.districtId}
                          onChange={handleDistrictChange}
                          disabled={!isEditable || !formData.cityId}
                          className="w-full rounded border py-3 px-5 text-black bg-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        >
                          <option value="" disabled>
                            {formData.cityId ? "Select District" : "Select a City first"}
                          </option>
                          {districts.map(district => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>

                        {/* Error message */}
                        {!formData.cityId && (
                          <p className="text-red-500 text-sm mt-1">Select a City first</p>
                        )}

                      </div>

                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="street"
                        >
                          Address
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="street"
                          id="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          disabled={!isEditable} // Disable input if not editable
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Modify Button */}
            {!isEditable && (
              <div className="pt-5 w-full flex flex-row-reverse">
                <button

                  className="modify-button flex justify-center rounded bg-green-400 border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  type="button"
                  onClick={handleModifyClick}
                >
                  Modify
                </button>
              </div>
            )}

            {/* Cancel and Save Buttons */}
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
                >
                  Save
                </button>
              </div>
            )}
          </div>

    </DefaultLayout>
  );
}

export default Settings;
