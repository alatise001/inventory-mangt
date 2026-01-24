import Image from "next/image";
import React from "react";

export default function Loading() {
  return (
    <div className="h-[80vh] flex justify-center items-center">
      <Image
        className=" "
        src="/loading.svg"
        alt="Vercel logomark"
        width={250}
        height={250}
      />
    </div>
  );
}
