"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = ImageProps & { skeletonClassName?: string };

/**
 * Wraps next/image with a skeleton placeholder shown until the real image
 * has actually loaded, then cross-fades it in. Works with both `fill` (pass
 * skeletonClassName="absolute inset-0" on a `relative` parent  --  the default)
 * and fixed width/height usage.
 */
export default function ImageWithSkeleton({
  className,
  skeletonClassName = "absolute inset-0",
  onLoad,
  ...props
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton className={skeletonClassName} />}
      <Image
        {...props}
        className={`${className ?? ""} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
