import Image from "next/image";
import React from "react";

export default function Loading() {
  return (
    <div className="h-[70vh] flex justify-center items-center">
      <Image
        className=" "
        src="/loading.svg"
        alt="Vercel logomark"
        width={200}
        height={200}
      />
    </div>
  );
}
