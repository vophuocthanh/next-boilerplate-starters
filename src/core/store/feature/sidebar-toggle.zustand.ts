import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SidebarToggleState {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const useSidebarToggle = create<SidebarToggleState>()(
  devtools(
    persist(
      (set) => ({
        collapsed: false,
        toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
      }),
      {
        name: "sidebar-toggle",
      },
    ),
  ),
);

export { useSidebarToggle };
