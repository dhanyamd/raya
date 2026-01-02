
import { create } from "zustand";

type SidebarTab = "Collections" | "History" | "Share" | "Code";

interface SidebarStore {
    activeTab: SidebarTab;
    setActiveTab: (tab: SidebarTab) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    activeTab: "Collections",
    setActiveTab: (tab) => set(() => ({ activeTab: tab })),
}));
