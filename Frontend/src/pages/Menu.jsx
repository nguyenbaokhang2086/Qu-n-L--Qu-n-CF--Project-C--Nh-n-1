import { useState } from "react";
import { Search, Plus, Sparkles, X, ChevronDown, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { usePersistentState } from "../hooks/usePersistentState";
// ── Mock data cho menu ──
const CATEGORIES = ["Tất cả", "Cà phê", "Trà", "Nước ép", "Bánh"];
// ── Mock data cho menu ──
const INITIAL_MENU_ITEMS = [
  {
    id: 1,
    name: "Cà phê Latte",
    category: "Cà phê",
    sold: "85 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Trà Đào Cam Sả",
    category: "Trà",
    sold: "92 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Bánh Croissant Bơ",
    category: "Bánh",
    sold: "56 cốc",
    status: "HẾT MÓN",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Nước Ép Cam",
    category: "Nước ép",
    sold: "42 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Espresso Sữa Đá",
    category: "Cà phê",
    sold: "124 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Bạc Xỉu Nghệ Thuật",
    category: "Cà phê",
    sold: "98 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1461023058043-03348164b2a6?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Croissant Trứng Muối",
    category: "Bánh",
    sold: "32 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Cold Brew Cam Sả",
    category: "Cà phê",
    sold: "68 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Trà Đào Thanh Yên",
    category: "Trà",
    sold: "45 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Matcha Latte",
    category: "Trà",
    sold: "38 cốc",
    status: "CÒN MÓN",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80",
  },
];
// ── Hàm xử lý cập nhật menu ──
const Menu = () => {
  const [menuItems, setMenuItems] = usePersistentState("artisan.menu", INITIAL_MENU_ITEMS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cà phê");
  const [description, setDescription] = useState("");
  const [priceS, setPriceS] = useState("40000");
  const [priceM, setPriceM] = useState("50000");
  const [priceL, setPriceL] = useState("60000");
  const [imageLink, setImageLink] = useState("X-D1ZFTHvdDkvZCFcEAJUpZPSXSWFUDrDpvRkw_dmbEuLw_cQH");
  // ── Hàm lọc món nước theo category và tên ──
  const filtered = menuItems.filter((item) => {
    const matchCategory = activeCategory === "Tất cả" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });
  // ── Hàm xử lý lưu món nước ──
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên món nước!");
      return;
    }
  
    const newItem = {
      id: menuItems.reduce((highestId, item) => Math.max(highestId, Number(item.id) || 0), 0) + 1,
      name: name,
      category: category,
      sold: "0 cốc",
      status: "CÒN MÓN",
      // Nếu link bắt đầu bằng http thì giữ, không thì dùng ảnh mặc định đẹp mắt
      image: imageLink.startsWith("http")
        ? imageLink
        : "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=80",
    };

    setMenuItems([newItem, ...menuItems]);
    toast.success(`Đã lưu thành công món: ${name}`);

    // Reset Form & Close
    setName("");
    setCategory("Cà phê");
    setDescription("");
    setPriceS("40000");
    setPriceM("50000");
    setPriceL("60000");
    setImageLink("X-D1ZFTHvdDkvZCFcEAJUpZPSXSWFUDrDpvRkw_dmbEuLw_cQH");
    setShowAddModal(false);
  };
// ── Hàm xử lý xóa món nước ──
  const handleDeleteProduct = (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${item.name}" khỏi thực đơn không?`)) return;

    setMenuItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id));
    toast.success(`Đã xóa món: ${item.name}`);
  };

  return (
    <div className="p-5 space-y-5 bg-[#0d1117]">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-white tracking-tight">Quản Lý Thực Đơn</h2>
          <p className="text-[12px] text-white/45 mt-0.5">
            Xem, sửa, thêm mới, hoặc gỡ bỏ các đồ uống, món bánh và thiết lập khoảng giá.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-black text-[12px] font-extrabold rounded-lg transition-all shadow-[0_4px_12px_rgba(251,191,36,0.15)]"
        >
          <Plus size={15} strokeWidth={2.5} />
          Thêm món mới
        </button>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/[0.04] pt-4">
        
        {/* Categories Tabs */}
        <div className="flex bg-[#13181f] p-1 rounded-lg border border-white/[0.08] gap-1 overflow-x-auto w-full md:w-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all whitespace-nowrap ${
                activeCategory === c
                  ? "bg-amber-400 text-black shadow-md"
                  : "text-white/45 hover:text-white/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-[280px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm món, nguyên liệu..."
            className="w-full bg-[#13181f] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-[12.5px] text-white placeholder-white/35 focus:outline-none focus:border-amber-400/40 transition-all"
          />
        </div>
      </div>

      {/* ── Menu Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-[#13181f] rounded-xl overflow-hidden border border-white/[0.08] transition-all hover:border-white/20"
          >
            {/* Image section with tag */}
            <div className="relative h-[160px] w-full overflow-hidden bg-white/5">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className={`absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1 rounded-md text-white tracking-wider ${
                  item.status === "CÒN MÓN" ? "bg-emerald-500" : "bg-white/20 text-white/60"
                }`}
              >
                {item.status}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteProduct(item)}
                aria-label={`Xóa món ${item.name}`}
                title={`Xóa món ${item.name}`}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/70 transition-colors hover:border-red-400/40 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Content section */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-1.5">
                  {item.category}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[13.5px] font-extrabold text-white leading-tight">
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-white/30 shrink-0 font-medium">
                    Đã bán: {item.sold}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL THÊM MÓN ĐỒ UỐNG MỚI ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#13181f] border border-white/[0.08] rounded-2xl w-full max-w-[420px] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <span className="text-[13px] font-extrabold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Thêm Món Đồ Uống Mới
              </span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-left">
              
              {/* Row 1: Tên món nước & Danh mục món */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                    Tên món nước
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bạc Xỉu..."
                    className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[12.5px] text-white placeholder-white/20 focus:outline-none focus:border-amber-400/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                    Danh mục món
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[12.5px] text-white focus:outline-none focus:border-amber-400/40 transition-all appearance-none pr-8"
                    >
                      {CATEGORIES.filter(c => c !== "Tất cả").map((c) => (
                        <option key={c} value={c} className="bg-[#13181f] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Mô tả tóm tắt */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                  Mô tả tóm tắt
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Hương vị nổi bật của..."
                  className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[12.5px] text-white placeholder-white/20 focus:outline-none focus:border-amber-400/40 transition-all h-20 resize-none"
                />
              </div>

              {/* Row 3: Thiết lập bảng giá */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase block mb-1">
                  Thiết lập bảng giá cà phê (đ)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-bold text-white/30 uppercase tracking-wider block">Size S</span>
                    <input
                      type="number"
                      value={priceS}
                      onChange={(e) => setPriceS(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-amber-400/40 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-bold text-white/30 uppercase tracking-wider block">Size M</span>
                    <input
                      type="number"
                      value={priceM}
                      onChange={(e) => setPriceM(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-amber-400/40 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-bold text-white/30 uppercase tracking-wider block">Size L</span>
                    <input
                      type="number"
                      value={priceL}
                      onChange={(e) => setPriceL(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-amber-400/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Đường dẫn ảnh trực tiếp */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                  Đường dẫn ảnh trực tiếp
                </label>
                <input
                  type="text"
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-amber-400/40 transition-all font-mono"
                />
              </div>

              {/* Footer: Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-[13.5px] py-3.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(251,191,36,0.2)]"
                >
                  Xác nhận lưu sản phẩm
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Menu;
