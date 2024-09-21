import clsx from "clsx";
import { ForwardedRef, Ref, forwardRef } from "react";

export type FichaColor = 'red' | 'yellow' | null;

interface FichaProps {
  type: FichaColor
  size?: number
  border?: boolean
  className?: string
  refVal?: Ref<HTMLDivElement>
}

export const Ficha = forwardRef(({ size = 80, border = false, className, type }: FichaProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      style={{ width: size, height: size}}
      className={
        clsx(
          {
            ['border-2']: border, 
            ['h-20 w-20 rounded-full border-stone-500']: true,
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