import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, LayoutDashboard, BookOpen, FlaskConical, Users, Menu, Moon, Sun,
  Search, Flame, ChevronDown, Code2,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/lab", label: "Interactive Lab", icon: FlaskConical },
  { to: "/community", label: "Community", icon: Users },
  { to: "/visual", label: "Visual Learning", icon: Code2 },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarWidth = collapsed ? 72 : 248;

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-sidebar border-r border-sidebar-border"
      >
        <SidebarInner collapsed={collapsed} path={path} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border md:hidden"
            >
              <SidebarInner collapsed={false} path={path} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: 0 }}>
        <div className="hidden md:block" style={{ width: sidebarWidth, flexShrink: 0 }} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 md:ml-0" style={{ marginLeft: 0 }}>
        <motion.div
          animate={{ marginLeft: 0 }}
          className="flex-1 flex flex-col min-w-0"
          style={{ marginLeft: 0 }}
        >
          {/* Top navbar */}
          <header
            className="sticky top-0 z-20 h-14 bg-background/80 backdrop-blur border-b border-border flex items-center gap-3 px-4"
            style={{ marginLeft: 0 }}
          >
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            ><Menu className="w-5 h-5" /></button>
            <button
              className="hidden md:inline-flex p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            ><Menu className="w-5 h-5" /></button>

            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search courses, lessons, docs..."
                className="w-full h-9 pl-9 pr-3 rounded-md bg-muted/60 border border-transparent focus:bg-background focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/40 text-sm transition-all"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggle}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)] flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  AK
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30">
                  <Flame className="w-3 h-3" /> 7d
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg p-2 text-sm"
                  >
                    <div className="px-3 py-2 border-b border-border">
                      <div className="font-medium">Alex Kim</div>
                      <div className="text-muted-foreground text-xs">alex@codepath.dev</div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-muted-foreground">Coding Streak</span>
                      <span className="inline-flex items-center gap-1 text-warning font-medium">
                        <Flame className="w-3.5 h-3.5" /> 7 Days
                      </span>
                    </div>
                    {["Profile", "Settings", "Sign out"].map((i) => (
                      <button key={i} className="w-full text-left px-3 py-1.5 rounded hover:bg-accent">{i}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <main className="flex-1 min-w-0">{children}</main>
        </motion.div>
      </div>
    </div>
  );
}

function SidebarInner({
  collapsed, path, onNavigate,
}: { collapsed: boolean; path: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)] flex items-center justify-center text-primary-foreground">
          <Code2 className="w-4 h-4" />
        </div>
        {!collapsed && <span className="font-semibold tracking-tight">CodePath</span>}
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative ${
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary"
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="rounded-lg p-3 bg-gradient-to-br from-primary/10 to-[oklch(0.65_0.2_200)]/10 border border-primary/20">
            <div className="text-xs font-medium">Upgrade to Pro</div>
            <div className="text-xs text-muted-foreground mt-1">Unlock all courses & AI mentor</div>
          </div>
        </div>
      )}
    </>
  );
}
