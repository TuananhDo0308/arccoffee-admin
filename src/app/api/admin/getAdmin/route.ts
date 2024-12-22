import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/utils'

export const GET = async (request: NextRequest) => {
    try {
        const token = request.headers.get('Authorization');
        const response = await httpClient.get({
            url: apiLinks.admin.getAdmin,
            token: token
        });

        const data = response.data;
        // Return the access token to the client
        return NextResponse.json(data , { status: 200 });

    } catch (error) {
        console.error('Error during authentication:', error);

        // Handle errors from the external API or other issues
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to authenticate';
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