import { Calendar, Filter } from "lucide-react";
import { Button } from "./ui/button";

interface PageHeaderProps {
    title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl text-white/90 uppercase tracking-wide">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 px-3 sm:px-4 text-xs sm:text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden xs:inline">Oct 1 - Oct 31, 2023</span>
                    <span className="xs:hidden">Oct 2023</span>
                </Button>
                <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 px-3 sm:px-4 text-xs sm:text-sm">
                    <Filter className="w-4 h-4" />
                    <span>All Categories</span>
                </Button>
            </div>
        </div>
    );
}
