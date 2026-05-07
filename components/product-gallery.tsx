"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          unoptimized
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, idx) => (
            <button
              key={image + idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[3/4] overflow-hidden border ${
                idx === activeIndex ? "border-stone-900" : "border-stone-200"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width:768px) 33vw, 16vw"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
