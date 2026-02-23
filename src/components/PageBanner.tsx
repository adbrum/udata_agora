'use client';

import React from 'react';
import { Breadcrumb } from '@ama-pt/agora-design-system';

interface PageBannerProps {
    title: string;
    breadcrumbItems: { label: string; url: string }[];
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
    variant?: 'dark' | 'light';
    image?: {
        src: string;
        alt: string;
        className?: string;
    };
}

const PageBanner: React.FC<PageBannerProps> = ({
    title,
    breadcrumbItems,
    subtitle,
    children,
    variant = 'dark',
    image,
}) => {
    const isLight = variant === 'light';

    return (
        <div
            className={`agora-card-highlight-newsletter ${isLight ? '' : 'bg-primary-900 bg-lines-image'}`}
            style={isLight ? {
                backgroundColor: '#F7F7FF',
            } : {
                backgroundImage: 'url("/banner-lines.svg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="card-container relative z-10 pt-32 pb-48 md:py-64">
                <div className="container mx-auto px-4">
                    <Breadcrumb
                        darkMode={!isLight}
                        items={breadcrumbItems}
                        className="mb-16"
                    />
                    <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
                        {/* Left Column: Texts */}
                        <div className="xl:col-span-6 xl:block md:pt-64">
                            <div className="title">
                                <h1 className={`xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold mt-8 ${isLight ? 'text-primary-900' : 'text-white'}`}>
                                    {title}
                                </h1>
                            </div>
                            {subtitle && (
                                <div className="subtitle mt-16">
                                    {/* Handle subtitle text color for light variant if it's a string */}
                                    {typeof subtitle === 'string' ? (
                                        <p className={`${isLight ? 'text-neutral-700' : 'text-primary-100'} text-lg leading-relaxed`}>{subtitle}</p>
                                    ) : (
                                        subtitle
                                    )}
                                </div>
                            )}
                            {children && (
                                <div className={`w-full mt-32 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                                    {children}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Flexible content (Image) */}
                        <div className="xl:col-span-6 md:pt-64 flex justify-end">
                            {image && (
                                <div className="image-container mb-16 last:mb-0">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className={`max-w-full h-auto object-contain drop-shadow-xl ${image.className || ''}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageBanner;
