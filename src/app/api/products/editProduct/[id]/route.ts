import { NextResponse, NextRequest } from 'next/server';
import { httpClient, apiLinks } from '@/utils';
import axios from 'axios';

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params; // Lấy id từ URL

    if (!id) {
        return NextResponse.json(
            { message: 'Product ID is required' },
            { status: 400 }
        );
    }

    try {
        const token = req.headers.get('Authorization'); // Lấy token từ Header

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized: Missing Authorization token' },
                { status: 401 }
            );
        }

        // Đọc FormData từ request
        const formData = await req.formData();

        // Gọi API PUT
        const response = await httpClient.put({
            url: `${apiLinks.product.editProduct}/${id}`, // Đường dẫn động
            data: formData, // Truyền trực tiếp FormData
            contentType: 'multipart/form-data', // Định dạng content type
            token: token, // Token xác thực
        });
        return NextResponse.json(
            { message: 'Product updated successfully', data: response.data },
            { status: 200 }
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Lỗi từ Axios
            console.error('Axios error:', error.response?.data || error.message);

            const status = error.response?.status || 500;
            const errorMessage =
                error.response?.data?.message || 'Failed to update product';

            return NextResponse.json(
                { message: errorMessage },
                { status: status }
            );
        } else {
            // Lỗi không xác định
            console.error('Unexpected error:', error);

            return NextResponse.json(
                { message: 'Internal Server Error' },
                { status: 500 }
            );
        }
    }
};
