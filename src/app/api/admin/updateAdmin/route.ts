import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/utils';
import { Message } from '@mui/icons-material';
import { useAppSelector } from '@/hooks/hook';

export const PUT = async (request: NextRequest) => {
    try {
        const body = await request.json(); // Lấy dữ liệu từ request body
        console.log(`Content of body:`, body);
        const token = request.headers.get('Authorization');

        const adminData  = body; // Lấy ID admin và dữ liệu còn lại


        // Gọi API với httpClient.put
        const response = await httpClient.put({
            url: apiLinks.admin.updateAdmin,
            data: adminData, // Truyền dữ liệu admin vào body
            token: token
        });

        // Trả về phản hồi thành công từ API
        return NextResponse.json({message: "updateAdmin successful", data: response.data}, { status: 200 });

    } catch (error) {
        console.error('Error during update:', error);

        // Handle errors from the external API or other issues
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update';
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
