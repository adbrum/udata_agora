"use client"
import React, { useMemo, useRef, useEffect } from 'react'
import { twJoin } from 'tailwind-merge';

export type IInfoBlockIFrame = {
    className?: string,
    src: string,
}

export default function InfoBlockIFrame({
    className,
    src,
}: IInfoBlockIFrame) {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const hideBottomPx = 90  // barra de navegação de páginas
    const hideTopPx = 0   // logo bar
    const embedUrl = useMemo(() => {
        try {
            const url = new URL(src);
            url.searchParams.set('chromeless', '1');
            url.searchParams.set('navContentPaneEnabled', 'false');
            url.searchParams.set('filterPaneEnabled', 'false');
            url.searchParams.set('actionBarEnabled', 'false');   // barra de ações
            url.searchParams.set('pagesVisibility', 'false');     // tab de páginas (nav inferior)
            url.searchParams.set('noSignInButton', 'true');
            url.searchParams.set('hints', 'false');
            url.searchParams.set('showcaseSampleData', 'false');
            return url.toString();
        } catch {
            return src;
        }
    }, [src])

    

    return (
        <div
            className={twJoin("relative overflow-hidden pb-[56%] flex item-center justify-center", className)}
        >
            <iframe
                ref={iframeRef}
                src={embedUrl}
                className='absolute top-0 left-0 w-full h-full'
                allow="fullscreen"
            />
        </div>
    )
}
