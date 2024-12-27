"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Giả sử bạn đã có context quản lý user
import { httpClient, clientLinks } from "@/utils"; // Import API client
import { setToken } from "@/slices/authSlice";
import { useAppDispatch } from "@/hooks/hook";

const SignIn: React.FC = () => {
  // State variables để lưu trữ giá trị input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch()

  // Hàm xử lý đăng nhập
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành động gửi form mặc định

    try {
      const credentials = {
        login: username, // Dùng username và password từ state
        password: password,
      };

      // Gọi API đăng nhập
      const response = await httpClient.post({
        url: clientLinks.admin.signin, // Dùng clientLinks để lấy URL đăng nhập
        data: credentials, // Truyền thông tin đăng nhập
      });

      // Kiểm tra kết quả và xử lý đăng nhập thành công
      if (response.data.accessToken) {
        dispatch(setToken(response.data));  // Giả sử API trả về token trong response.data
        console.log("Admin signed in:", response.data);
      } else {
        setErrorMessage("Đăng nhập không thành công");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Đăng nhập không thành công");
    }
  };

  return (
    <div className="h-full w-full z-50 items-center justify-center bg-white flex">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.png"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo2.png"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
              </p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to DoubleAdmin
              </h2>

              {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

              <form onSubmit={handleSignIn}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username} // Bind the input to the state
                      onChange={(e) => setUsername(e.target.value)}  // Update state on change
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="6+ Characters, 1 Capital letter"
                      value={password}  // Bind the input to the state
                      onChange={(e) => setPassword(e.target.value)}  // Update state on change
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg bg-primary py-4 text-center text-base font-semibold text-white shadow-md focus:outline-none"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;