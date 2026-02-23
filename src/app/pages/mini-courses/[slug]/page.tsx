import React from 'react';
import MiniCourseDetailClient from '@/components/mini-courses/MiniCourseDetailClient';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // In a real application, we would fetch the mini course data based on the slug
    // For now, we render the static design as requested
    const { slug } = await params;


    return <MiniCourseDetailClient />;
}
