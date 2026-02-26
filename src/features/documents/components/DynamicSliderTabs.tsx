import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface DynamicSliderTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    label?: string;
}

export default function DynamicSliderTabs({
    tabs,
    activeTab,
    onTabChange,
    label,
}: DynamicSliderTabsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Check if scrolling is needed
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [tabs]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(checkScroll, 300);
        }
    };

    const handleScroll = () => {
        checkScroll();
    };

    return (
        <div className="mb-6">
            {label && (
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    {label}
                </p>
            )}

            <div className="relative flex items-center gap-3">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 z-10 p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                )}

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-x-auto scrollbar-hide"
                >
                    <div className="flex gap-2 pb-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all font-medium text-sm flex-shrink-0 ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 z-10 p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <ChevronRight size={18} className="text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
}
