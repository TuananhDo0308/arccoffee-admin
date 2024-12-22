import { Category } from "@mui/icons-material";

const authUrl = 'http://localhost:5078';

const apiLinks = {
  user: {
    signin:`${authUrl}/api/authentication/login`,
    region: `${authUrl}/api/regions`
  },
  homepage: {
    menu:`${authUrl}/api/homepage/menu`,
    product: `${authUrl}/api/products`,
    Category: `${authUrl}/api/categories`
  },
  admin: {
    signin: `${authUrl}/api/authentication/login`,
    updateAdmin: `${authUrl}/api/arc-shop/profile/`,
    getAdmin: `${authUrl}/api/arc-shop/profile`,
    region: `${authUrl}/api/regions`,
  }
};

export default apiLinks;
