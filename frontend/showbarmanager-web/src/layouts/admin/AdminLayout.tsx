import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "../../components/layout/Sidebar"
import { Topbar } from "../../components/layout/Topbar"

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="h-screen w-screen bg-background text-text overflow-hidden">
      <div className="h-full w-full flex overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />

        <div className="flex-1 min-w-0 h-screen overflow-hidden flex flex-col">
          <Topbar />

          <main className="flex-1 min-h-0 overflow-y-auto app-scrollbar">
            <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-5 xl:px-6 py-4 lg:py-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}