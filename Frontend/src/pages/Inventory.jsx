import { Sparkles, AlertTriangle, Check, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { usePersistentState } from "../hooks/usePersistentState";
// ── Mock data cho kho nguyên liệu ──
const INITIAL_ITEMS = [
  {
    id: 1,
    sku: "SKU: CP-RB-001",
    name: "Cà phê hạt Robusta",
    supplier: "Cung cấp: Đắk Lắk Roasters",
    current: 26.5,
    max: 30,
    unit: "Kg",
    safe: 10,
    updated: "2 giờ trước",
    status: "ỔN ĐỊNH",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&fit=crop&q=80",
  },
  {
    id: 2,
    sku: "SKU: NL-TN-012",
    name: "Sữa tươi nguyên chất",
    supplier: "Cung cấp: Dalat Milk",
    current: 4.2,
    max: 36,
    unit: "Lít",
    safe: 12,
    updated: "15 phút trước",
    status: "SẮP HẾT",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&fit=crop&q=80",
  },
  {
    id: 3,
    sku: "SKU: NL-SR-005",
    name: "Syrup Vanilla",
    supplier: "Cung cấp: Monin Roasters Co.",
    current: 15,
    max: 15,
    unit: "Chai 1L",
    safe: 5,
    updated: "8 giờ trước",
    status: "ỔN ĐỊNH",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=80&fit=crop&q=80",
  },
  {
    id: 4,
    sku: "SKU: NL-DG-002",
    name: "Đường trắng tinh luyện",
    supplier: "Cung cấp: Biên Hòa Sugar",
    current: 50,
    max: 50,
    unit: "Túi 1Kg",
    safe: 10,
    updated: "Hôm qua",
    status: "ỔN ĐỊNH",
    image: "https://images.unsplash.com/photo-1581781870027-04212e231e96?w=80&fit=crop&q=80",
  },
  {
    id: 5,
    sku: "SKU: CP-AR-002",
    name: "Cà phê hạt Arabica",
    supplier: "Cung cấp: Đà Lạt Sommelier Co.",
    current: 2.5,
    max: 30,
    unit: "Kg",
    safe: 10,
    updated: "3 giờ trước",
    status: "SẮP HẾT",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&fit=crop&q=80",
  },
];
//
const Inventory = () => {
  const [items, setItems] = usePersistentState("artisan.inventory", INITIAL_ITEMS);
// ── Hàm xử lý cập nhật số lượng nguyên liệu ──
  const handleUpdate = (id, amount) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newCurrent = Math.max(0, Math.min(item.max, Number((item.current + amount).toFixed(1))));
          const newStatus = newCurrent <= item.safe ? "SẮP HẾT" : "ỔN ĐỊNH";
          return { ...item, current: newCurrent, status: newStatus, updated: "Vừa xong" };
        }
        return item;
      })
    );
  };
// ── Hàm xử lý phê duyệt bản nháp AI và tạo phiếu mua hàng ──
  const approveAI = () => {
    toast.success("Đã duyệt bản nháp AI và tạo phiếu mua hàng thành công!");
  };

  return (
    <div className="p-5 space-y-5 bg-[#0d1117]">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-white tracking-tight">Quản Lý Nguyên Liệu Kho</h2>
          <p className="text-[12px] text-white/45 mt-0.5">
            Giám sát nguyên vật liệu chế biến của Baristas, nhận cảnh báo hết hàng và phê duyệt phiếu bổ sung.
          </p>
        </div>
      </div>

      {/* ── AI Recommendation Bar ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-[12px] font-extrabold text-amber-400 tracking-wider uppercase">
              KHUYẾN NGHỊ ĐẶT HÀNG TỰ ĐỘNG TỪ AI
            </h4>
            <p className="text-[11.5px] text-white/70 mt-1 leading-relaxed">
              Sữa tươi Dalat Milk và hạt Coffee Arabica sắp cạn kiệt. Đặt mua <span className="text-amber-400 font-bold">40L Dalat Milk + 20Kg Arabica Blend</span>.
            </p>
          </div>
        </div>
        <button
          onClick={approveAI}
          className="px-4.5 py-2.5 bg-amber-400 hover:bg-amber-500 text-black text-[12px] font-extrabold rounded-lg transition-all shrink-0 shadow-[0_4px_12px_rgba(251,191,36,0.15)]"
        >
          Duyệt Bản Nháp AI
        </button>
      </div>

      {/* ── Inventory Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const ratio = (item.current / item.max) * 100;
          const isLow = item.status === "SẮP HẾT";

          return (
            <div
              key={item.id}
              className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-white/25 transition-all"
            >
              {/* Top details */}
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest leading-none mb-1">
                    {item.sku}
                  </p>
                  <h4 className="text-[13.5px] font-extrabold text-white truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10.5px] text-white/35 mt-0.5 truncate">
                    {item.supplier}
                  </p>
                </div>
              </div>

              {/* Progress and Stock values */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-white/40">Tôn hiện tại</span>
                  <span className={`text-[13.5px] font-extrabold ${isLow ? "text-amber-400" : "text-emerald-400"}`}>
                    {item.current} <span className="text-white/40 font-normal">/ {item.max} {item.unit}</span>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLow ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${Math.min(100, ratio)}%` }}
                  />
                </div>
                {/* Limits and updates */}
                <div className="flex justify-between text-[10px] text-white/30 font-medium">
                  <span>Cảnh báo an toàn: {item.safe} {item.unit}</span>
                  <span>Cập nhật: {item.updated}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-1">
                {isLow ? (
                  <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md">
                    <AlertTriangle size={11} />
                    SẮP HẾT
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md">
                    <Check size={11} />
                    ỔN ĐỊNH
                  </span>
                )}

                {/* Adjust buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleUpdate(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center bg-[#0d1117] hover:bg-white/5 border border-white/[0.08] text-white/50 hover:text-white rounded-lg transition-all"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    onClick={() => handleUpdate(item.id, 5)}
                    className="px-3 h-7 text-[11px] font-bold bg-[#1d2430] hover:bg-[#252f3f] border border-white/[0.08] text-amber-400 rounded-lg transition-all"
                  >
                    Bổ sung
                  </button>
                  <button
                    onClick={() => handleUpdate(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center bg-[#0d1117] hover:bg-white/5 border border-white/[0.08] text-white/50 hover:text-white rounded-lg transition-all"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Inventory;
