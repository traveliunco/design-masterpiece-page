/**
 * مكون Skeleton للبطاقات
 * يُستخدم أثناء تحميل البيانات
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
    <div className={cn("animate-pulse bg-muted rounded-md", className)} />
);

export const DestinationCardSkeleton = () => (
    <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {/* Image Skeleton */}
        <div className="relative h-64 bg-muted animate-pulse" />

        {/* Content Skeleton */}
        <div className="p-6 space-y-4">
            {/* Title */}
            <Skeleton className="h-7 w-3/4" />

            {/* Description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    </div>
);

export const HotelCardSkeleton = () => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Skeleton className="h-48" />
        <div className="p-5 space-y-3">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-full" />
                ))}
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full" />
                ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
    </div>
);

export const FlightCardSkeleton = () => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden p-6">
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Flight Info */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-center space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                    <Skeleton className="h-1 flex-1 mx-4" />
                    <div className="text-center space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                </div>
            </div>
            {/* Price */}
            <div className="lg:w-48 space-y-3 text-center">
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    </div>
);

export const DestinationsGridSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(count)].map((_, i) => (
            <DestinationCardSkeleton key={i} />
        ))}
    </div>
);

export default Skeleton;
