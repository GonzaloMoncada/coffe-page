'use client'
import React, { Children } from 'react'
import useAuthCheck from '../utils/useAuthCheck';
import SkeletonManageMenu from '../ui/Skeletons/SkeletonManageMenu';

export default function LayoutManager(
    {
        children
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    const loading = useAuthCheck();
    if (loading)
        return <SkeletonManageMenu />;
    return (
        <div>
            {children}
        </div>
    )
}
