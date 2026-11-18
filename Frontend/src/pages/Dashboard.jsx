import { TrendingUp, CheckSquare2, Users2, AlertTriangle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// ── Mock data (Khớp hoàn hảo 100% với đường cong biểu đồ trong Ảnh 1) ──
const WEEK_DATA = [
  { day: "Thứ 2", revenue: 3200000 },
  { day: "Thứ 3", revenue: 3500000 },
  { day: "Thứ 4", revenue: 3300000 },
  { day: "Thứ 5", revenue: 3800000 },
  { day: "Thứ 6", revenue: 3600000 },
  { day: "Thứ 7", revenue: 4500000 },
  { day: "Chủ Nhật", revenue: 3100000 },
];
// ── Mock data cho các món bán chạy nhất và cảnh báo tồn kho ──
const BEST_SELLERS = [
  { rank: 1, name: "Espresso Sữa Đá", category: "Cà phê", sold: "124 cốc", icon: "☕" },
  { rank: 2, name: "Bạc Xỉu Nghệ Thuật", category: "Cà phê", sold: "98 cốc", icon: "🧋" },
  { rank: 3, name: "Cà phê Latte", category: "Cà phê", sold: "85 cốc", icon: "☕" },
];
// ── Mock data cho cảnh báo tồn kho ──
const SUPPLY_ALERTS = [
  { item: "Sữa tươi nguyên chất", current: "4.2 Lít", target: "12" },
  { item: "Cà phê hạt Arabica", current: "2.5 Kg", target: "10" },
];
// ── Hàm định dạng tiền tệ VND ──
const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

// ── SVG Line Chart ──
const RevenueChart = ({ data }) => {
  const W = 600, H = 180, PAD = { t: 20, r: 25, b: 30, l: 25 };
  const vals = data.map((d) => d.revenue);
  const min = Math.min(...vals) * 0.82;
  const max = Math.max(...vals) * 1.05;
  const gW = W - PAD.l - PAD.r;
  const gH = H - PAD.t - PAD.b;

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1)) * gW,
    y: PAD.t + (1 - (d.revenue - min) / (max - min)) * gH,
    ...d,
  }));

  // Tạo đường cong trơn tru Bezier mượt mà
  const pathD = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const cpX1 = pts[i - 1].x + gW / (data.length - 1) / 2;
      const cpY1 = pts[i - 1].y;
      const cpX2 = p.x - gW / (data.length - 1) / 2;
      const cpY2 = p.y;
      return `C ${cpX1} ${cpY1} ${cpX2} ${cpY2} ${p.x} ${p.y}`;
    })
    .join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - PAD.b} L ${pts[0].x} ${H - PAD.b} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "180px" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines mờ */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line key={r}
          x1={PAD.l} y1={PAD.t + gH * r}
          x2={PAD.l + gW} y2={PAD.t + gH * r}
          stroke="rgba(255,255,255,0.03)" strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#areaGrad)" />

      {/* Line vẽ */}
      <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]" />

      {/* Các chấm chấm tròn to rực rỡ */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5.5" fill="#13181f" stroke="#f59e0b" strokeWidth="2.5" />
        </g>
      ))}

      {/* Nhãn Thứ ngày */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 6} textAnchor="middle"
          fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="inherit" fontWeight="600">
          {p.day}
        </text>
      ))}
    </svg>
  );
};

// ── Stat Card ──
const StatCard = ({ icon: Icon, iconBg, label, value, sub, subColor = "text-green-400", borderStyle }) => (
  <div className={`bg-[#13181f] border rounded-xl p-4 flex flex-col gap-2 transition-all hover:bg-white/[0.01] ${borderStyle ? borderStyle : "border-white/[0.08]"}`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{label}</span>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={13} />
      </div>
    </div>
    <p className="text-2xl font-extrabold text-white leading-none tracking-tight">{value}</p>
    {sub && <p className={`text-[11px] font-medium ${subColor}`}>{sub}</p>}
  </div>
);

// ── Dashboard ──
const Dashboard = () => {
  return (
    <div className="p-5 space-y-5 bg-[#0d1117]">
      
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-white tracking-tight">Bảng Điều Khiển Tổng Quan</h2>
          <p className="text-[12px] text-white/45 mt-0.5">
            Giám sát thời gian thực năng suất quán, hàng tồn kho và báo cáo Barista.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[11px] font-bold rounded-lg hover:bg-amber-500/20 transition-all">
          <Sparkles size={12} className="text-amber-400" />
          Hỗ trợ AI để xuất tự động đã kích hoạt
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          icon={TrendingUp}
          iconBg="bg-amber-500/15 text-amber-400"
          label="Doanh thu hôm nay"
          value={fmt(4120000)}
          sub="+14.5% so với hôm qua"
          subColor="text-amber-400"
          borderStyle="border-amber-500/30"
        />
        <StatCard
          icon={CheckSquare2}
          iconBg="bg-green-500/15 text-green-400"
          label="Đơn hàng hoàn thành"
          value="42 đơn"
          sub="+8 đơn ròng vừa thanh toán"
          subColor="text-green-400"
          borderStyle="border-green-500/30"
        />
        <StatCard
          icon={Users2}
          iconBg="bg-blue-500/15 text-blue-400"
          label="Công suất phục vụ"
          value="33%"
          sub="4/12 bàn đang có khách ăn"
          subColor="text-blue-400"
          borderStyle="border-blue-500/30"
        />
        <StatCard
          icon={AlertTriangle}
          iconBg="bg-orange-500/15 text-orange-400"
          label="Cảnh báo tồn kho"
          value="2 nguyên liệu"
          sub="Cần mua thêm sữa, cafe mạnh"
          subColor="text-orange-400"
          borderStyle="border-orange-500/30"
        />
      </div>

      {/* Chart + Right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-bold text-white tracking-tight">Xu Hướng Doanh Thu Tuần</h3>
              <p className="text-[11px] text-white/35 mt-0.5">Thống kê tích lũy thứ 2 đến chủ nhật</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> Doanh thu tuần này
              </span>
            </div>
          </div>
          <RevenueChart data={WEEK_DATA} />
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-3">
          
          {/* Supply alerts */}
          <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={13} className="text-amber-500" />
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Cảnh báo nguồn cung cấp</h3>
            </div>
            <p className="text-[11px] text-white/45 mb-3 leading-relaxed">
              Nguyên liệu thiết yếu đã chạm ngưỡng nguy hiểm, vui lòng bổ sung để tránh gián đoạn dịch vụ Barista:
            </p>
            <div className="space-y-2">
              {SUPPLY_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <div>
                    <p className="text-[11.5px] font-bold text-white">{alert.item}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      Còn lại: <span className="text-red-400 font-semibold">{alert.current}</span> (Mức an toàn: {alert.target})
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-extrabold rounded transition-all">
                    Bổ sung ngay
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Best sellers */}
          <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Món bán chạy nhất hôm nay</h3>
            </div>
            <div className="space-y-2.5">
              {BEST_SELLERS.map((item) => (
                <div key={item.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[15px]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white/40">{item.sold}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Quick actions bar */}
      <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold text-white">Xử lý nhanh bàn phục vụ</p>
          <p className="text-[11px] text-white/40 mt-0.5">Truy cập sơ đồ bố trí bàn và ghi nhận yêu cầu nước uống lập tức.</p>
        </div>
        <Link to="/tables" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-[12px] font-extrabold rounded-lg transition-all shadow-[0_4px_12px_rgba(251,191,36,0.15)]">
          Khởi động POS thu ngân →
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
