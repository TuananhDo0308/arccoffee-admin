import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/utils';

export const POST = async (request: NextRequest) => {
    const formData = await request.formData();
    console.log("formData: ", formData)
    try {
        const token = request.headers.get('Authorization');

        if (!token) {
            return NextResponse.json(
                { message: 'Authorization token is missing' },
                { status: 401 }
            );
        }

       
        const response = await httpClient.post({
            url: apiLinks.product.addProduct,
            data: formData, 
            token: token,
            contentType: 'multipart/form-data',
        });

        console.log("response.data: ", response.data)

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error during post product:', error);

        // Xử lý lỗi từ API bên ngoài hoặc các vấn đề khác
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to post product';
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
