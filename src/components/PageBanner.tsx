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
            <div className="card-container relative z-10 pt-8 pb-20">
                <div className="card-content w-full">
                    <div className="container mx-auto px-4">
                        <Breadcrumb
                            darkMode={!isLight}
                            items={breadcrumbItems}
                            className="mb-16"
                        />

                        <div className={image ? "grid grid-cols-1 md:grid-cols-2 gap-48 items-center" : ""}>
                            <div className="w-full">
                                <div className="title">
                                    <h1 className={`xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold mt-24 ${isLight ? 'text-primary-900' : 'text-white'}`}>
                                        {title}
                                    </h1>
                                </div>
                                {subtitle && (
                                    <div className="subtitle mt-16">
                                        {/* Handle subtitle text color for light variant if it's a string */}
                                        {typeof subtitle === 'string' ? (
                                            <p className={`${isLight ? 'text-neutral-700' : 'text-primary-100'} mb-8 text-lg leading-relaxed`}>{subtitle}</p>
                                        ) : (
                                            subtitle
                                        )}
                                    </div>
                                )}
                            </div>

                            {image && (
                                <div className="flex justify-end items-center">
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

                {children && (
                    <div className="input-container mt-32">
                        <div className="email-bar">
                            <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                                <div className={`relative ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageBanner;
