import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/utils';

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params; // Lấy id từ URL

    try {
        const token = req.headers.get('Authorization'); // Lấy token từ Header
        // Gọi API và truyền id vào URL động
        const response = await httpClient.delete({
            url: `${apiLinks.category.deleteCategory}/${id}`, // Đường dẫn động
            token: token
        });

        return NextResponse.json(
            { message: 'Product deleted successfully', data: response.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during delete api:', error);

        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to delete product';
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

