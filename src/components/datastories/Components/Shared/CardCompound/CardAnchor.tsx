"use client"
import { Anchor, AnchorProps } from '@ama-pt/agora-design-system'
import { twJoin } from 'tailwind-merge'

export default function CardAnchor(args: AnchorProps) {
    return (
        <div>
            <Anchor {...args} className={twJoin("!justify-start", args.className)}
                trailingIcon={args.trailingIcon ?? 'agora-line-arrow-right-circle'}
                trailingIconActive={args.trailingIconActive ?? 'agora-line-arrow-right-circle'}
                trailingIconHover={args.trailingIconHover ?? 'agora-solid-arrow-right-circle'}
            />
        </div>
    )
}
