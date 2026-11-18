import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LayoutGrid,
  UtensilsCrossed,
  PackageSearch,
  BarChart3,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Bell,
  Users,
  Clock as ClockIcon,
} from "lucide-react";
import { usePersistentState } from "../hooks/usePersistentState";

const navItems = [
  { to: "/",            label: "Tổng Quan",          icon: LayoutDashboard, end: true },
  { to: "/tables",      label: "Sơ Đồ Bàn - POS",    icon: LayoutGrid },
  { to: "/menu",        label: "Thực Đơn",            icon: UtensilsCrossed },
  { to: "/inventory",   label: "Kho Nguyên Liệu",    icon: PackageSearch },
  { to: "/reservations",label: "Đội Ngũ Nghệ Nhân",  icon: Users },
  { to: "/reports",     label: "Báo Cáo & Phân Tích", icon: BarChart3 },
];

const Clock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-2 text-[12px] text-white/50 bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-lg">
      <ClockIcon size={13} className="text-white/40" />
      <span>{now.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}</span>
      <span className="text-amber-400 font-mono font-bold ml-1">
        {now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </div>
  );
};

const Layout = () => {
  const [collapsed, setCollapsed] = usePersistentState("artisan.sidebar.collapsed", false);

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white overflow-hidden font-sans">
      
      {/* ── HEADER FULL-WIDTH ── */}
      <header className="flex items-center justify-between px-5 bg-[#13181f] border-b border-white/[0.08] h-[60px] flex-shrink-0">
        
        {/* Logo (Bên trái Header) */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Coffee size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-white tracking-wide leading-tight">Artisan Canvas</p>
            <p className="text-[8.5px] font-extrabold text-amber-500 tracking-[0.08em] mt-0.5 uppercase">Barista Premium Edition</p>
          </div>
        </div>

        {/* Cụm chức năng (Bên phải Header) */}
        <div className="flex items-center gap-3">
          <Clock />

          {/* Bell Notification */}
          <button className="relative w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-all">
            <Bell size={14} className="text-white/50" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[9px] font-extrabold flex items-center justify-center text-white">2</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1.5 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0 overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-bold text-white leading-tight">Nguyễn Minh Hoàng</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                <span className="text-[9px] font-bold text-white/40 uppercase">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── PHẦN THÂN (SIDEBAR + CONTENT) ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar (Nằm dưới Header) */}
        <aside className={`flex flex-col bg-[#13181f] border-r border-white/[0.08] transition-all duration-300 flex-shrink-0 justify-between ${collapsed ? "w-[60px]" : "w-[220px]"}`}>
          
          <div className="flex flex-col flex-1">
            {/* Section label */}
            {!collapsed && (
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em] px-4 pt-4 pb-2">
                QUẢN TRỊ NGHIỆP VỤ
              </p>
            )}

            {/* Nav Menu */}
            <nav className="px-2 py-1 space-y-1 overflow-y-auto">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 relative group
                    ${isActive
                      ? "bg-amber-400/[0.06] border border-amber-400/20 text-amber-400 shadow-[inset_0_1px_1px_rgba(251,191,36,0.05)]"
                      : "text-white/40 border border-transparent hover:text-white/80 hover:bg-white/[0.02]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-400 rounded-r-full" />}
                      <Icon size={15} className={`flex-shrink-0 ${isActive ? "text-amber-400" : "text-white/30 group-hover:text-white/50"}`} />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom Area (Hộp khởi động + Collapse) */}
          <div className="p-3 border-t border-white/[0.06] space-y-2">
            {!collapsed && (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                  <span className="text-[10px] font-bold text-white/70 uppercase">Hộp khởi động chuẩn</span>
                </div>
                <p className="text-[9px] text-white/30">Model: GEMINI-2.5-FLASH</p>
                <p className="text-[9px] font-bold text-amber-500/80 tracking-wider">BARISTA POS ACTIVE</p>
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center h-8 rounded-lg border border-white/[0.08] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0d1117]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;
