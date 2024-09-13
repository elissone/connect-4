import clsx from "clsx";
import { ForwardedRef, Ref, forwardRef } from "react";

export type FichaColor = 'red' | 'yellow' | null;

interface FichaProps {
  type: FichaColor
  className?: string
  refVal?: Ref<HTMLDivElement>
}

export const Ficha = forwardRef(({ className, type }: FichaProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      className={
        clsx(
          {
            ['h-20 w-20 m-2 rounded-full border-2 border-gray-700']: true,
            ['bg-red-500']: type === 'red',
            ['bg-yellow-500']: type === 'yellow',
            [className ?? '']: !!className,
          }
        )
      }
    />
  )
});

export default Ficha;