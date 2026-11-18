import { useState } from "react";
import { Check, Minus, Plus, Layers, X, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { usePersistentState } from "../hooks/usePersistentState";

// --- Mock Data ---
const FLOORS = ["Tất cả", "Trống", "Đang sử dụng"];

const INITIAL_TABLES = [
  { id: 4, name: "Bàn 04", status: "occupied", orderId: "ORD-2849", floor: "TẦNG 1" },
  { id: 5, name: "Bàn 05", status: "available", floor: "TẦNG 1" },
  { id: 6, name: "Bàn 06", status: "occupied", orderId: "ORD-3012", floor: "TẦNG 1" },
  { id: 7, name: "Bàn 07", status: "available", floor: "TẦNG 1" },
  { id: 8, name: "Bàn 08", status: "available", floor: "TẦNG 1" },
  { id: 9, name: "Bàn 09", status: "occupied", orderId: "ORD-3199", floor: "TẦNG 1" },
  { id: 10, name: "Bàn 10", status: "available", floor: "TẦNG 1" },
  { id: 11, name: "Bàn 11", status: "available", floor: "TẦNG 1" },
  { id: 12, name: "Bàn 12", status: "available", floor: "TẦNG 1" },
  { id: 1, name: "Bàn 01", status: "available", floor: "TẦNG 1" },
  { id: 2, name: "Bàn 02", status: "occupied", orderId: "ORD-3200", floor: "TẦNG 1" },
  { id: 3, name: "Bàn 03", status: "available", floor: "TẦNG 1" },
];

const MOCK_CATEGORIES = ["Cà phê", "Trà", "Nước ép", "Bánh"];

const QUICK_ITEMS_BY_CAT = {
  "Cà phê": [
    { id: 101, name: "Cà phê Latte (L)", price: 65000, image: "☕" },
    { id: 104, name: "Espresso Sữa Đá", price: 55000, image: "☕" },
    { id: 105, name: "Bạc Xỉu Nghệ Thuật", price: 52000, image: "🧋" },
    { id: 106, name: "Cold Brew Cam Sả", price: 65000, image: "🍹" },
  ],
  "Trà": [
    { id: 107, name: "Trà Đào Cam Sả", price: 50000, image: "🍹" },
    { id: 108, name: "Trà Đào Thanh Yên", price: 45000, image: "🍵" },
    { id: 103, name: "Matcha Latte (L)", price: 65000, image: "🍵" },
  ],
  "Nước ép": [
    { id: 109, name: "Nước Ép Cam", price: 40000, image: "🍹" },
    { id: 110, name: "Nước Ép Dưa Hấu", price: 40000, image: "🍉" },
  ],
  "Bánh": [
    { id: 102, name: "Bánh Croissant Bơ (S)", price: 45000, image: "🥐" },
    { id: 111, name: "Croissant Trứng Muối", price: 50000, image: "🥐" },
  ],
};

const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + "đ";

const Tables = () => {
  const [tables, setTables] = usePersistentState("artisan.tables", INITIAL_TABLES);
  const [filter, setFilter] = usePersistentState("artisan.tables.filter", "Tất cả");
  const [selectedTableId, setSelectedTableId] = usePersistentState("artisan.tables.selectedId", 4);
  const [activeCategory, setActiveCategory] = usePersistentState("artisan.tables.category", "Cà phê");
  const [showReceipt, setShowReceipt] = useState(false);
  const [applyTax, setApplyTax] = usePersistentState("artisan.tables.applyTax", true);

  // Cart của từng bàn lưu trữ trong state
  const [cartsByTable, setCartsByTable] = usePersistentState("artisan.tables.carts", {
    4: [
      { id: 101, name: "Cà phê Latte (L)", price: 65000, quantity: 2 },
      { id: 102, name: "Bánh Croissant Bơ (S)", price: 45000, quantity: 1 },
      { id: 103, name: "Matcha Latte (L)", price: 65000, quantity: 1 }
    ],
    6: [
      { id: 104, name: "Espresso Sữa Đá", price: 55000, quantity: 2 },
      { id: 102, name: "Bánh Croissant Bơ (S)", price: 45000, quantity: 1 }
    ],
    9: [
      { id: 101, name: "Cà phê Latte (L)", price: 65000, quantity: 2 },
      { id: 105, name: "Bạc Xỉu Nghệ Thuật", price: 52000, quantity: 1 }
    ],
    2: [
      { id: 104, name: "Espresso Sữa Đá", price: 55000, quantity: 1 },
      { id: 108, name: "Trà Đào Thanh Yên", price: 45000, quantity: 1 }
    ]
  });
  const [, setPaymentHistory] = usePersistentState("artisan.payments", []);

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const isOccupied = selectedTable?.status === "occupied"; 
  const cart = cartsByTable[selectedTableId] || [];

  // Tính toán
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = applyTax ? subTotal * 0.15 : 0;
  const total = subTotal + tax;

  const handleTableClick = (id) => {
    setSelectedTableId(id);
  };

  const updateCartQuantity = (itemId, delta) => {
    setCartsByTable((prev) => {
      const currentCart = prev[selectedTableId] || [];
      const updatedCart = currentCart
        .map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      // Cập nhật lại trạng thái bàn nếu giỏ trống/có món
      setTables((prevTables) =>
        prevTables.map((t) => {
          if (t.id === selectedTableId) {
            const hasItems = updatedCart.length > 0;
            return {
              ...t,
              status: hasItems ? "occupied" : "available",
              orderId: hasItems ? (t.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`) : undefined
            };
          }
          return t;
        })
      );

      return {
        ...prev,
        [selectedTableId]: updatedCart,
      };
    });
  };

  const addQuickItem = (item) => {
    setCartsByTable((prev) => {
      const currentCart = prev[selectedTableId] || [];
      const existing = currentCart.find((i) => i.id === item.id);
      let updatedCart;

      if (existing) {
        updatedCart = currentCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...currentCart, { ...item, quantity: 1 }];
      }

      // Đánh dấu bàn đang sử dụng
      setTables((prevTables) =>
        prevTables.map((t) => {
          if (t.id === selectedTableId) {
            return {
              ...t,
              status: "occupied",
              orderId: t.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`
            };
          }
          return t;
        })
      );

      return {
        ...prev,
        [selectedTableId]: updatedCart,
      };
    });
    toast.success(`Đã thêm ${item.name} vào ${selectedTable?.name}`);
  };

  const handlePay = () => {
    if (cart.length === 0) return;
    setShowReceipt(true);
  };

  const confirmCashPayment = () => {
    const paidAt = new Date().toISOString();
    const paidOrder = {
      id: `${selectedTable?.orderId || "ORD"}-${paidAt}`,
      tableId: selectedTableId,
      tableName: selectedTable?.name,
      orderId: selectedTable?.orderId,
      items: cart.map((item) => ({ ...item })),
      subtotal: subTotal,
      tax,
      total,
      paidAt,
    };
    setPaymentHistory((prev) => [...prev, paidOrder]);

    // Thanh toán xong giải phóng bàn
    setTables((prevTables) =>
      prevTables.map((t) => {
        if (t.id === selectedTableId) {
          return { ...t, status: "available", orderId: undefined };
        }
        return t;
      })
    );
    // Xóa giỏ hàng bàn này
    setCartsByTable((prev) => ({
      ...prev,
      [selectedTableId]: [],
    }));
    setShowReceipt(false);
    toast.success(`Đã thanh toán hóa đơn bàn ${selectedTable?.name} thành công!`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-5 p-5 bg-[#0d1117] overflow-hidden">
      
      {/* ── BÊN TRÁI: SƠ ĐỒ BÀN ── */}
      <div className="flex-1 flex flex-col bg-[#13181f] border border-white/[0.08] rounded-xl p-5 overflow-hidden">
        
        {/* Header Sơ Đồ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-amber-400" />
              Sơ Đồ Tầng Trệt
            </h2>
            <p className="text-[12px] text-white/40 mt-1">Chọn một bàn bất kỳ để xem và nạp hóa đơn pha chế.</p>
          </div>
          
          <div className="flex bg-[#0d1117] p-1 rounded-lg border border-white/[0.08]">
            {FLOORS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-[12px] font-medium rounded-md transition-all ${
                  filter === f 
                    ? "bg-[#1f2937] text-amber-400" 
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách Bàn Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {tables.filter(t => 
              filter === "Tất cả" ? true : 
              filter === "Trống" ? t.status === "available" : 
              t.status === "occupied"
            ).map((table) => {
              const isSelected = table.id === selectedTableId;
              const isOcc = table.status === "occupied";
              const tableCart = cartsByTable[table.id] || [];
              const tableSubtotal = tableCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const tableTotal = applyTax ? tableSubtotal * 1.15 : tableSubtotal;
              
              return (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table.id)}
                  className={`
                    relative flex flex-col justify-between p-4 rounded-xl text-left border transition-all h-[110px]
                    ${isSelected 
                      ? "border-amber-400 bg-amber-400/[0.05] shadow-[0_0_15px_rgba(251,191,36,0.1)]" 
                      : "border-white/[0.08] bg-[#1a202c] hover:border-white/20"}
                  `}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className={`font-bold text-[14px] ${isSelected ? "text-white" : "text-white/80"}`}>
                      {table.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full mt-1 ${isOcc ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
                  </div>
                  
                  <div className="mt-auto">
                    {isOcc ? (
                      <>
                        <div className="text-[10px] text-amber-400/80 mb-0.5">{table.orderId}</div>
                        <div className="font-bold text-[14px] text-white">
                          {formatCurrency(tableTotal)}
                        </div>
                      </>
                    ) : (
                      <div className="text-[12px] text-white/30 italic">Trống</div>
                    )}
                  </div>
                  
                  {/* Floor Label */}
                  <div className="absolute bottom-3 right-3 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded uppercase border border-amber-400/20">
                    {table.floor}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BÊN PHẢI: POS / THU NGÂN ── */}
      <div className="w-full lg:w-[400px] flex flex-col bg-[#13181f] border border-white/[0.08] rounded-xl p-5 overflow-hidden shrink-0">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-bold text-amber-400 tracking-widest mb-1">THU NGÂN & PHA CHẾ</div>
            <div className="text-white text-lg font-bold">
              {selectedTable?.name} <span className="text-white/30 text-sm font-normal">({selectedTable?.orderId || "Chưa gọi món"})</span>
            </div>
          </div>
          <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase transition-colors ${isOccupied ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/40"}`}>
            {isOccupied ? "ĐANG SỬ DỤNG" : "BÀN TRỐNG"}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1">
          {cart.length > 0 ? cart.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#0d1117] border border-white/[0.08] rounded-xl p-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-white leading-none mb-1.5">{item.name}</h4>
                  <p className="text-[11.5px] text-amber-400 font-medium">{formatCurrency(item.price)}</p>
                </div>
              </div>
              
              {/* Điều khiển tăng giảm số lượng */}
              <div className="flex items-center gap-3 bg-[#13181f] rounded-lg border border-white/10 px-1 py-1">
                <button 
                  onClick={() => updateCartQuantity(item.id, -1)}
                  className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white bg-white/5 rounded-md transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-[13px] font-bold text-white w-3 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateCartQuantity(item.id, 1)}
                  className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white bg-white/5 rounded-md transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-white/20 text-[13px] py-10">
              <span>Bàn chưa nạp hóa đơn</span>
              <span className="text-[11px] text-white/10 mt-1">Chọn phím nóng bên dưới để gọi món</span>
            </div>
          )}
        </div>

        {/* Thêm Món Nhanh */}
        <div className="border-t border-white/[0.08] pt-4 mb-4">
          <div className="text-[10px] font-bold text-white/40 tracking-widest mb-3 flex items-center gap-2">
            <span className="text-amber-400">⚡</span> THÊM MÓN NHANH PHÍM NÓNG
          </div>
          
          {/* Tabs Danh mục phím nóng */}
          <div className="flex gap-2 mb-3 bg-[#0d1117] p-1 rounded-lg border border-white/[0.08]">
            {MOCK_CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 py-1.5 text-[11.5px] font-bold rounded-md transition-all ${
                  activeCategory === cat 
                    ? "bg-[#1f2937] text-amber-400" 
                    : "text-white/45 hover:text-white/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Phím nóng tương ứng */}
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ITEMS_BY_CAT[activeCategory].map((item) => (
              <button 
                key={item.id} 
                onClick={() => addQuickItem(item)}
                className="flex items-center gap-3 bg-[#0d1117] border border-white/[0.08] hover:border-amber-400/30 rounded-lg p-2 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-[14px]">
                  {item.image}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                  <p className="text-[10px] text-amber-400 font-bold">{formatCurrency(item.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thanh Toán Section */}
        <div className="border-t border-white/[0.08] pt-4 mt-auto">
          <div className="space-y-2 mb-4 text-[13px]">
            <div className="flex justify-between items-center text-white/60">
              <span>Tạm tính</span>
              <span className="font-semibold text-white">{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-white/60">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={applyTax} 
                  onChange={(e) => setApplyTax(e.target.checked)}
                  className="accent-amber-400 w-3.5 h-3.5 rounded-sm bg-transparent border-white/20" 
                />
                Thuế GTGT (15%)
              </label>
              <span className="font-semibold text-white">{formatCurrency(tax)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-amber-400 font-bold text-[15px]">Cần thanh toán</span>
            <span className="text-amber-400 font-extrabold text-[18px]">{formatCurrency(total)}</span>
          </div>

          <button
            onClick={handlePay}
            disabled={cart.length === 0}
            className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-400 disabled:cursor-not-allowed text-black font-extrabold text-[13.5px] py-3.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(251,191,36,0.25)] flex justify-center items-center gap-2"
          >
            💲 Thanh toán & Hóa đơn
          </button>
        </div>
      </div>

      {/* ── MODAL HÓA ĐƠN IN THỬ NGHIỆM ── */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#13181f] border border-white/[0.08] rounded-2xl w-full max-w-[380px] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <span className="text-[12.5px] font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Printer size={15} />
                Hóa đơn in thử nghiệm
              </span>
              <button 
                onClick={() => setShowReceipt(false)}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body Hóa đơn mô phỏng giấy in */}
            <div className="p-5 bg-white text-black overflow-y-auto max-h-[500px]">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-[17px] font-black tracking-tight text-gray-900">ARTISAN CANVAS COFFEE</h3>
                <p className="text-[9.5px] font-extrabold text-gray-400 tracking-wider uppercase mt-0.5">Premium Barista Experience</p>
                <p className="text-[9.5px] text-gray-500 mt-2">Địa chỉ: 12 Hàng Khay, Hoàn Kiếm, Hà Nội</p>
                <p className="text-[9.5px] text-gray-500">ĐT: +84 24 3824 5678</p>
              </div>

              {/* Dòng gạch đứt */}
              <div className="border-t border-dashed border-gray-300 w-full my-3" />

              {/* Metadata hóa đơn */}
              <div className="grid grid-cols-2 gap-y-1.5 text-[10px] text-gray-700 font-medium">
                <div>HỌ SỐ: <span className="font-bold text-gray-900">{selectedTable?.orderId || "ORD-2849"}</span></div>
                <div className="text-right">BÀN: <span className="font-bold text-gray-900">{selectedTable?.name}</span></div>
                <div>GIỜ: <span className="font-bold text-gray-900">13:35</span></div>
                <div className="text-right">NGÀY: <span className="font-bold text-gray-900">22/5/2026</span></div>
                <div className="col-span-2 flex justify-between items-center mt-1 border-t border-gray-100 pt-1.5">
                  <span>THU NGÂN: <span className="font-bold text-gray-900">Nguyễn Minh Hoàng</span></span>
                  <span className="flex items-center gap-1 text-green-700 font-extrabold text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    ĐÃ KẾT CA
                  </span>
                </div>
              </div>

              {/* Dòng gạch đứt */}
              <div className="border-t border-dashed border-gray-300 w-full my-3" />

              {/* Bảng sản phẩm */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider pb-1">
                  <span className="w-[55%]">Sản phẩm</span>
                  <span className="w-[15%] text-center">SL</span>
                  <span className="w-[30%] text-right">Đơn giá</span>
                </div>

                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-gray-800 font-bold leading-tight">
                    <span className="w-[55%] font-bold text-gray-900">{item.name}</span>
                    <span className="w-[15%] text-center text-gray-600 font-medium">{item.quantity}</span>
                    <span className="w-[30%] text-right font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Dòng gạch đứt */}
              <div className="border-t border-dashed border-gray-300 w-full my-3" />

              {/* Phần tổng cộng tiền */}
              <div className="space-y-1.5 text-[11px] text-gray-600 font-bold">
                <div className="flex justify-between">
                  <span>TỔNG TIỀN MÓN</span>
                  <span className="text-gray-900 font-black">{formatCurrency(subTotal)}</span>
                </div>
                {applyTax && (
                  <div className="flex justify-between">
                    <span>THUẾ GTGT (15%)</span>
                    <span className="text-gray-900 font-black">{formatCurrency(tax)}</span>
                  </div>
                )}
                
                {/* Dòng gạch đứt */}
                <div className="border-t border-dashed border-gray-300 w-full my-2" />

                <div className="flex justify-between text-[13.5px] font-black text-gray-900 pt-0.5">
                  <span>TỔNG CỘNG THU</span>
                  <span className="text-gray-900 font-black">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Dòng gạch đứt */}
              <div className="border-t border-dashed border-gray-300 w-full my-3" />

              {/* QR Code thanh toán VNPay */}
              <div className="flex flex-col items-center mt-3">
                <div className="border border-amber-400/50 rounded-2xl p-4 bg-white flex flex-col items-center justify-center w-[160px] h-[160px] shadow-sm">
                  {/* SVG mô phỏng QR Code */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-gray-900">
                    {/* 3 Corner finders */}
                    <rect x="0" y="0" width="28" height="28" fill="currentColor" rx="4" />
                    <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                    <rect x="8" y="8" width="12" height="12" fill="currentColor" rx="1" />

                    <rect x="72" y="0" width="28" height="28" fill="currentColor" rx="4" />
                    <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                    <rect x="80" y="8" width="12" height="12" fill="currentColor" rx="1" />

                    <rect x="0" y="72" width="28" height="28" fill="currentColor" rx="4" />
                    <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                    <rect x="8" y="80" width="12" height="12" fill="currentColor" rx="1" />

                    {/* QR Code Dots & Patterns */}
                    <rect x="40" y="4" width="8" height="8" fill="currentColor" />
                    <rect x="52" y="0" width="8" height="16" fill="currentColor" />
                    <rect x="40" y="16" width="16" height="8" fill="currentColor" />
                    <rect x="64" y="20" width="8" height="8" fill="currentColor" />

                    <rect x="36" y="36" width="12" height="12" fill="currentColor" rx="2" />
                    <circle cx="42" cy="42" r="3" fill="white" />
                    
                    <rect x="72" y="40" width="8" height="16" fill="currentColor" />
                    <rect x="88" y="36" width="8" height="12" fill="currentColor" />

                    <rect x="4" y="40" width="16" height="8" fill="currentColor" />
                    <rect x="16" y="52" width="12" height="8" fill="currentColor" />

                    <rect x="40" y="60" width="20" height="8" fill="currentColor" />
                    <rect x="36" y="76" width="8" height="16" fill="currentColor" />
                    <rect x="52" y="84" width="16" height="8" fill="currentColor" />
                    
                    <rect x="76" y="72" width="12" height="12" fill="currentColor" />
                    <rect x="88" y="88" width="8" height="8" fill="currentColor" />
                  </svg>
                  
                  <span className="text-amber-600 font-extrabold text-[8px] tracking-[0.12em] uppercase mt-2.5">
                    VNPAY QR-CODE SECURE
                  </span>
                </div>

                <p className="text-[10px] font-black text-amber-600 tracking-wide mt-3 uppercase">
                  QUÉT ĐỂ BIỂU DIỄN THANH TOÁN
                </p>
                <p className="text-[9px] text-gray-400 text-center italic mt-1.5 leading-relaxed max-w-[240px]">
                  Cảm ơn Quý khách! Hẹn gặp lại quý khách tại không gian sáng tạo Artisan!
                </p>
              </div>

            </div>

            {/* Footer Modal: Nút Thu tiền mặt */}
            <div className="p-4 bg-[#13181f] border-t border-white/[0.06]">
              <button
                onClick={confirmCashPayment}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-[13.5px] py-3.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(251,191,36,0.2)]"
              >
                Xác nhận thu tiền mặt (In ra)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Tables;
