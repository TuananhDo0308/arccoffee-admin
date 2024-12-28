import React from "react";
import { Skeleton } from "@nextui-org/react";

const ProductsSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 mb-4">
          <Skeleton className="rounded-full w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductsSkeleton;
