'use client';

import React from 'react';
import { Breadcrumb } from '@ama-pt/agora-design-system';

interface PageBannerProps {
    title: string;
    breadcrumbItems: { label: string; url: string }[];
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
}

const PageBanner: React.FC<PageBannerProps> = ({
    title,
    breadcrumbItems,
    subtitle,
    children,
}) => {
    return (
        <div
            className="agora-card-highlight-newsletter bg-primary-900 bg-lines-image"
            style={{
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
                            darkMode={true}
                            items={breadcrumbItems}
                            className="mb-4"
                        />
                        <div className="title">
                            <h1 className="xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold text-white mt-64">
                                {title}
                            </h1>
                        </div>
                        {subtitle && (
                            <div className="subtitle">
                                {typeof subtitle === 'string' ? (
                                    <p className="text-primary-100 mb-8 max-w-3xl">{subtitle}</p>
                                ) : (
                                    subtitle
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {children && (
                    <div className="input-container">
                        <div className="email-bar">
                            <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                                <div className="relative text-white">
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
