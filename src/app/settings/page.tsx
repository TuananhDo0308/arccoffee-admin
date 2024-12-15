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
  id: string | never;
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  roleId: string;
  branchId: string;
  branchName: string;
  regionId: string;
  regionName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  street: string;
}

interface AdminDataSubmit {
  firstName: string;       // Tên đầu
  lastName: string;        // Tên cuối
  username: string;        // Tên đăng nhập
  email: string;           // Email
  password: string;        // Mật khẩu
  phoneNumber: string;     // Số điện thoại
  gender: string;          // Giới tính
  year: number;            // Năm sinh
  month: number;           // Tháng sinh
  day: number;             // Ngày sinh
  regionId: string;        // ID vùng
  cityId: string;          // ID thành phố
  districtId: string;      // ID quận
  street: string;          // Đường phố
  roleId: string;          // Vai trò
  branchId: string;        // ID chi nhánh
}




const Settings = () => {
  const token = useAppSelector(state => state.auth.token)
  const [formData, setFormData] = useState<AdminData>({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    dob: "",
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


  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = 'your-auth-token-here'; // Token lấy từ nơi bạn lưu trữ (state, cookie, etc.)

        // Gọi API để lấy dữ liệu admin
        const response = await httpClient.get({
          url: clientLinks.admin.getAdmin,
          token: token,
        });

        const adminData = response.data
        // Cập nhật state với dữ liệu trả về
        setFormData(adminData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
      }
    };

    fetchAdminData(); // Gọi hàm fetchAdminData khi component mount
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component mount


  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        firstName: formData.firstName,       // Tên đầu
        lastName: formData.lastName,         // Tên cuối
        username: formData.username,         // Tên đăng nhập
        email: formData.email,               // Email
        password: formData.password,         // Mật khẩu
        phoneNumber: formData.phoneNumber,   // Số điện thoại
        gender: formData.gender,             // Giới tính
        year: formData.year,                 // Năm sinh
        month: formData.month,               // Tháng sinh
        day: formData.day,                   // Ngày sinh
        regionId: formData.regionId,         // ID vùng
        cityId: formData.cityId,             // ID thành phố
        districtId: formData.districtId,     // ID quận
        street: formData.street,             // Đường phố
        roleId: formData.roleId,             // Vai trò
        branchId: formData.branchId,         // ID chi nhánh
      };


      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }

      const response = await updateAdmin(data);

      setUser({
        ...user,
        str_ho_ten: formData.fullName,
        str_tai_khoan: formData.emailAddress,
        strsdt: formData.phoneNumber,
        ld_ngay_sinh: formData.dateOfBirth,
        str_dia_chi: formData.address,
        strimg: response.user.strimg || user.strimg,
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!user) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Settings" />
          <p className="text-center mt-10">Loading...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
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
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
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
                      name="emailAddress"
                      id="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
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
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <Image
                        src={
                          formData.profilePicture
                            ? URL.createObjectURL(formData.profilePicture)
                            : `${IMG_URL}/${user.strimg}`
                        }
                        width={55}
                        height={55}
                        alt="User"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <label
                          htmlFor="profilePictureInput"
                          className="text-sm hover:text-primary cursor-pointer"
                        >
                          Update
                        </label>
                        <input
                          type="file"
                          id="profilePictureInput"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
