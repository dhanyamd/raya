"use client";

import { Hint } from "@/components/ui/hint";
import { Archive, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSidebarStore } from "../store/useSidebarStore";

const TabbedLeftPanel = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { activeTab, setActiveTab } = useSidebarStore();

    // Determine if we are in the main workspace view (Rest API view)
    const isRestView = pathname === "/";

    const sidebarItems = [
        {
            icon: Archive,
            label: "Collections",
            type: "view", // Changes view state
            color: "text-neon-blue",
            activeBg: "bg-neon-blue/10 border-neon-blue"
        },
        {
            icon: Globe,
            label: "Realtime",
            type: "link", // Navigates to new route
            link: "/realtime",
            color: "text-neon-orange",
            activeBg: "bg-orange-purple/10 border-neon-orange"
        },
    ];

    const handleItemClick = (item: any) => {
        if (item.type === "link") {
            router.push(item.link);
        } else {
            // If we are not on the home page, go there first
            if (!isRestView) {
                router.push("/");
            }
            setActiveTab(item.label);
        }
    };

    return (
        <div className="w-12 h-full bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 space-y-4">
            {sidebarItems.map((item, index) => {
                const isActive = item.type === "link"
                    ? pathname === item.link
                    : isRestView && activeTab === item.label;

                return (
                    <Hint label={item.label} key={index} side="right">
                        <div
                            onClick={() => handleItemClick(item)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 border-2 ${isActive
                                ? `${item.activeBg} ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                        </div>
                    </Hint>
                );
            })}
        </div>
    );
};

export default TabbedLeftPanel;