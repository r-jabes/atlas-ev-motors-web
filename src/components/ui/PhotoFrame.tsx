import Image from "next/image";
import { cn } from "@/lib/cn";
import { needsIllustrativeLabel, type SiteImage } from "@/data/images";
import { IllustrativeTag } from "./IllustrativeTag";

/**
 * A photograph that fills its (relatively positioned) parent.
 * The Illustrative label is driven by the image registry, never hand-placed.
 */
export function PhotoFrame({
  image,
  sizes,
  priority,
  quality = 75,
  className,
  imgClassName,
  objectPosition,
  tagClassName,
  grain = true,
  hideTag = false,
}: {
  image: SiteImage;
  sizes: string;
  priority?: boolean;
  quality?: 60 | 75 | 85;
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
  tagClassName?: string;
  grain?: boolean;
  /** Set only when the caller renders the Illustrative label itself (e.g. outside a parallax layer). */
  hideTag?: boolean;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", grain && "grain", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn("object-cover", imgClassName)}
        style={objectPosition ? { objectPosition } : undefined}
      />
      {!hideTag && needsIllustrativeLabel(image) && <IllustrativeTag className={tagClassName} />}
    </div>
  );
}
