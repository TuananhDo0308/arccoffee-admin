import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { httpClient, apiLinks } from '@/src/utils'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { login, password } = body;

    const response = await httpClient.post({
      url: apiLinks.user.signin,
      data: {
        login,
        password,
      },
    });

    // Extract the access token from the external service's response
    const accessToken = response.data;

    // Return the access token to the client
    return NextResponse.json({ accessToken }, { status: 200 });

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
