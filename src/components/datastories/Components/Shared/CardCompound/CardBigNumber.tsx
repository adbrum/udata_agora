"use client"
import { formatNumberExtense } from '@/utils/numberConverter'
import { twJoin } from 'tailwind-merge'

export type CardBigNumberProps = {
    className?: string,
    number: number,
    locale?: string,
}


export default function CardBigNumber(args: CardBigNumberProps) {
    const { extense, numberResolve } = formatNumberExtense(args.number, args.locale)
    return (
        <div className={twJoin('text-white flex gap-8 items-baseline', args.className)}>
            <span className='text-3xl-bold number-resolve'>
                {numberResolve}
            </span>
            <span className='text-xl-light extense-resolve'>
                {extense}
            </span>
        </div>
    )
}
