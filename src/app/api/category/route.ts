import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/utils';

export const GET = async () => {
    try {
        // Thay đổi đường dẫn API từ apiLinks.user.region thành apiLinks.homepage.product
        const response = await httpClient.get({
            url: apiLinks.homepage.Category,  // Cập nhật ở đây
        });

        const data = response.data;

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error during get api:', error);

        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to get product api'; // Thay đổi thông điệp lỗi nếu cần
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
