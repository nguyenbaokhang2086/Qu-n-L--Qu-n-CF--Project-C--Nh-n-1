import { BarChart3, AlertCircle, Sparkles, TrendingUp, Receipt, Milestone } from "lucide-react";
import { usePersistentState } from "../hooks/usePersistentState";

const Reports = () => {
  const [paymentHistory] = usePersistentState("artisan.payments", []);
  const totalRevenue = paymentHistory.reduce((sum, payment) => sum + payment.total, 0);
  const averageOrder = paymentHistory.length ? totalRevenue / paymentHistory.length : 0;
  const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  const recentPayments = [...paymentHistory].reverse();

  return (
    <div className="p-5 space-y-5 bg-[#0d1117]">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-white tracking-tight">Báo Cáo & Phân Tích Doanh Số</h2>
          <p className="text-[12px] text-white/45 mt-0.5">
            Xem báo cáo bán hàng tự động tích lũy từ các giao dịch trực ca trực tuyến.
          </p>
        </div>
      </div>

      {/* ── Thân trang chia 2 phần (Cột trái 2/3, Cột phải 1/3) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        
        {/* BÊN TRÁI: Thống kê chính, Biểu đồ thanh ngang và Nhận định AI */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* 3 Stat Cards trên cùng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Card 1 */}
            <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-[100px]">
              <div>
                <p className="text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Doanh thu ròng ca</p>
                <p className="text-xl font-black text-white mt-1.5">{formatCurrency(totalRevenue)}</p>
              </div>
              <p className="text-[10px] font-bold text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp size={11} />
                Từ các hóa đơn đã thanh toán
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-[100px]">
              <div>
                <p className="text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Số đơn hạch toán</p>
                <p className="text-xl font-black text-white mt-1.5">{paymentHistory.length} bill</p>
              </div>
              <p className="text-[10px] font-bold text-white/35 mt-1 flex items-center gap-1">
                <Receipt size={11} />
                Đã lưu trên thiết bị này
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-[100px]">
              <div>
                <p className="text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Giá trị đơn TB</p>
                <p className="text-xl font-black text-white mt-1.5">{formatCurrency(averageOrder)}</p>
              </div>
              <p className="text-[10px] font-bold text-amber-400 mt-1 flex items-center gap-1">
                <Milestone size={11} />
                Phục vụ tối ưu
              </p>
            </div>

          </div>

          {/* Phân phối lượng đơn theo giờ */}
          <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-extrabold text-white tracking-tight">Phân Phối Lượng Đơn Theo Giờ</h3>
                <p className="text-[11px] text-white/35 mt-0.5">Thống kê mật độ giờ vàng đông khách</p>
              </div>
              <span className="text-[9px] font-extrabold text-white/30 tracking-widest border border-white/10 px-2 py-1 rounded-md">
                KHUNG GIỜ PHỤC VỤ
              </span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              
              {/* Khung 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11.5px]">
                  <span className="font-bold text-white/70">Giờ mở cửa (7:00 - 9:00)</span>
                  <span className="font-extrabold text-white/60">12 đơn</span>
                </div>
                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-white/20 rounded-full" style={{ width: "30%" }} />
                </div>
              </div>

              {/* Khung 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11.5px]">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    Coffee Sáng (9:00 - 11:30) <span className="text-[12px]">🔥</span>
                  </span>
                  <span className="font-extrabold text-white/60">28 đơn</span>
                </div>
                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              {/* Khung 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11.5px]">
                  <span className="font-bold text-white/70">Bữa trưa (11:30 - 14:00)</span>
                  <span className="font-extrabold text-white/60">18 đơn</span>
                </div>
                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-white/20 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              {/* Khung 4 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11.5px]">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    Trà Đào Chiều Cao Điểm (14:00 - 17:00) <span className="text-[12px]">🔥</span>
                  </span>
                  <span className="font-extrabold text-white/60">36 đơn</span>
                </div>
                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              {/* Khung 5 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11.5px]">
                  <span className="font-bold text-white/70">Chập tối gác ca (17:00 - 20:00)</span>
                  <span className="font-extrabold text-white/60">8 đơn</span>
                </div>
                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-white/20 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>

            </div>
          </div>

          {/* Nhận định AI */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-[12px] font-extrabold text-amber-400 tracking-wider uppercase">
                NHẬN ĐỊNH THÔNG MINH TỪ TRỢ LÝ AI
              </h4>
              <p className="text-[11.5px] text-white/70 mt-1 leading-relaxed">
                Mới: Món <span className="text-amber-400 font-bold">Cà phê Latte</span> hiện đang dẫn đầu nhóm Cà phê đóng góp 35% tổng số hóa đơn. Hiệu ứng mùa hè tăng mạnh 18% lượt mua sản phẩm <span className="text-amber-400 font-bold">Trà Đào Cam Sả</span> vào khung giờ chiều 14h-17h. Đề xuất: kích hoạt combo bánh ngọt ăn kèm nước ép để tối đa hóa doanh thu đầu người!
              </p>
            </div>
          </div>

        </div>

        {/* BÊN PHẢI: Nhật ký giao dịch trực ca */}
        <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-5 flex flex-col min-h-[464px] justify-between">
          <div>
            <h3 className="text-[14px] font-extrabold text-white flex items-center gap-2">
              <BarChart3 size={15} className="text-amber-500" />
              Nhật Ký Giao Dịch Trực ca
            </h3>
            <p className="text-[11px] text-white/35 mt-1">
              Danh sách các hóa đơn thời gian thực vừa kết toán.
            </p>
          </div>

          {recentPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-3">
                <AlertCircle size={20} className="text-white/20" />
              </div>
              <h4 className="text-[12.5px] font-extrabold text-white/60 leading-none">
                Chưa ghi nhận hóa đơn nào
              </h4>
              <p className="text-[10.5px] text-white/30 mt-2 leading-relaxed max-w-[200px] mx-auto">
                Thanh toán hóa đơn tại trang POS để giao dịch xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-start justify-between gap-3 border-t border-white/[0.06] pt-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">{payment.orderId || "Hóa đơn"} · {payment.tableName}</p>
                    <p className="text-[10px] text-white/40">
                      {new Date(payment.paidAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-amber-400">{formatCurrency(payment.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Reports;
