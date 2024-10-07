import clsx from "clsx";
import { ForwardedRef, MouseEventHandler, Ref, forwardRef, CSSProperties } from "react";

export type FichaColor = 'red' | 'yellow' | null;

interface FichaProps {
  type: FichaColor
  size?: number
  border?: boolean
  style?: CSSProperties
  className?: string
  refVal?: Ref<HTMLDivElement>
  onClick?: MouseEventHandler<HTMLDivElement>
}

export const Ficha = forwardRef((
  { size = 80, border = false, onClick, className, type, style }: FichaProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div>
      <div
        ref={ref}
        onClick={ onClick }
        style={{
          ...style,
          width: size,
          height: size,
        }}
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
    </div>
  )
});

export default Ficha;