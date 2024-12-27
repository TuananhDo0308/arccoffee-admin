import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/utils';

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
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

        // Gọi API PATCH mà không truyền body
        const response = await httpClient.patch({
            url: `${apiLinks.bill.updateStatusBills}/${id}`, // Đường dẫn động
            token: token, // Token xác thực
        });

        return NextResponse.json(
            { message: 'Product updateStatusBills successfully', data: response.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during patch api:', error);

        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to updateStatusBills';
            return NextResponse.json(
                { message: errorMessage },
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
