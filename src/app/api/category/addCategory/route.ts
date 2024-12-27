import { NextResponse, NextRequest } from 'next/server';
import { httpClient, apiLinks } from '@/utils';
import axios from 'axios';

export const POST = async (req: NextRequest) => {
    try {
        const token = req.headers.get('Authorization'); // Lấy token từ Header

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized: Missing Authorization token' },
                { status: 401 }
            );
        }

        // Lấy body từ request
        const body = await req.json();

        if (!body.name) {
            return NextResponse.json(
                { message: 'Category name is required' },
                { status: 400 }
            );
        }

        // Gọi API POST
        const response = await httpClient.post({
            url: apiLinks.category.addCategory, // Đường dẫn tới API
            data: body, // Dữ liệu body
            contentType: 'application/json', // Loại dữ liệu
            token: token, // Token xác thực
        });

        return NextResponse.json(
            { message: 'Category created successfully', data: response.data },
            { status: 201 }
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);

            const status = error.response?.status || 500;
            const errorMessage =
                error.response?.data?.message || 'Failed to create category';

            return NextResponse.json(
                { message: errorMessage },
                { status: status }
            );
        } else {
            console.error('Unexpected error:', error);

            return NextResponse.json(
                { message: 'Internal Server Error' },
                { status: 500 }
            );
        }
    }
};
