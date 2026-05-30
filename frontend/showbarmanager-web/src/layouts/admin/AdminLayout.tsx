import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "../../components/layout/Sidebar"
import { Topbar } from "../../components/layout/Topbar"

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text flex overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />

      <div className="flex-1 min-w-0 max-h-screen overflow-y-auto">
        <Topbar />

        <main className="p-4 lg:p-5 xl:p-6 max-w-[1800px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}