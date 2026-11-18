import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { usePersistentState } from "../hooks/usePersistentState";

// --- Mock Data ---
const INITIAL_STAFF = [
  {
    id: 1,
    name: "Nguyễn Minh Hoàng",
    role: "ADMIN",
    email: "hoang.nm@artisan.vn",
    phone: "+84 90 123 4567",
    active: true,
    orders: 86,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=80",
    permissions: { pos: true, inventory: true, reports: true }
  },
  {
    id: 2,
    name: "Lê Thị Thanh Trúc",
    role: "THU NGÂN",
    email: "truc.lt@artisan.vn",
    phone: "+84 98 987 6543",
    active: true,
    orders: 72,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&fit=crop&q=80",
    permissions: { pos: true, inventory: false, reports: false }
  },
  {
    id: 3,
    name: "Phạm Gia Bảo",
    role: "PHỤC VỤ",
    email: "bao.pg@artisan.vn",
    phone: "+84 91 222 3333",
    active: false,
    orders: 65,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&fit=crop&q=80",
    permissions: { pos: false, inventory: false, reports: false }
  }
];

const INITIAL_ATTENDANCE = [
  { name: "Nguyễn Minh Hoàng", days: ["X", "X", "X", "V", "X"] },
  { name: "Lê Thị Thanh Trúc", days: ["X", "X", "X", "X", "X"] },
  { name: "Phạm Gia Bảo", days: ["P", "P", "X", "X", "X"] }
];

const Reservations = () => {
  const [staffList, setStaffList] = usePersistentState("artisan.staff", INITIAL_STAFF);
  const [attendance, setAttendance] = usePersistentState("artisan.attendance", INITIAL_ATTENDANCE);

  const cycleAttendance = (staffName, dayIdx) => {
    const statusCycle = { "X": "V", "V": "P", "P": "X" };
    setAttendance(prev =>
      prev.map(row => {
        if (row.name === staffName) {
          const newDays = [...row.days];
          newDays[dayIdx] = statusCycle[newDays[dayIdx]];
          return { ...row, days: newDays };
        }
        return row;
      })
    );
    toast.success(`Đã cập nhật trạng thái chấm công của ${staffName}`);
  };

  const handlePermissionToggle = (staffId, permKey) => {
    // Chỉ Admin mới được chỉnh sửa
    setStaffList(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          return {
            ...s,
            permissions: {
              ...s.permissions,
              [permKey]: !s.permissions[permKey]
            }
          };
        }
        return s;
      })
    );
    toast.success("Đã cập nhật phân quyền nhân sự!");
  };

  return (
    <div className="p-5 space-y-5 bg-[#0d1117]">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-white tracking-tight">Đội Ngũ Nghệ Nhân</h2>
          <p className="text-[12px] text-white/45 mt-0.5">
            Giám sát chấm công hàng ngày, xem hiệu năng phục vụ và thiết lập quyền truy cập cho nhân sự.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-black text-[12px] font-extrabold rounded-lg transition-all shadow-[0_4px_12px_rgba(251,191,36,0.15)]">
          <Plus size={15} strokeWidth={2.5} />
          Thêm nhân viên mới
        </button>
      </div>

      {/* ── Thân trang chia 2 cột chính ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        
        {/* BÊN TRÁI & GIỮA (2/3): Danh sách nhân viên + Chấm công */}
        <div className="xl:col-span-2 space-y-5">
          
          {/* Grid thẻ nhân viên */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffList.map((s) => (
              <div
                key={s.id}
                className="relative bg-[#13181f] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-[150px] transition-all hover:border-white/20"
              >
                {/* Top Info */}
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-amber-500/80 bg-amber-500/5 border border-amber-500/15 px-1.5 py-0.5 rounded-md uppercase">
                      {s.role}
                    </span>
                    <h4 className="text-[14px] font-extrabold text-white mt-1 leading-none">{s.name}</h4>
                    <p className="text-[10px] text-white/30 mt-1 leading-none">{s.email}</p>
                    <p className="text-[10px] text-white/30 mt-1 leading-none">{s.phone}</p>
                  </div>
                </div>

                {/* Status Dot Top Right */}
                <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${s.active ? "bg-green-400" : "bg-white/20"}`} />

                {/* Bottom Stats */}
                <div className="border-t border-white/[0.06] pt-2.5 flex justify-between items-center text-[10.5px]">
                  <span className="text-white/30 font-bold uppercase tracking-wider">Lượng bán ra:</span>
                  <span className="font-extrabold text-white">{s.orders} đơn</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bảng chấm công tuần */}
          <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-[14px] font-extrabold text-white">Chấm Công Nghỉ Phép Tuần</h3>
                <p className="text-[11px] text-white/30 mt-0.5">Bấm trực tiếp vào các ô tròn để sửa chuyên cần (Chỉ Admin)</p>
              </div>
              
              {/* Legend chú thích */}
              <div className="flex items-center gap-3 text-[10.5px]">
                <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[8.5px] font-extrabold flex items-center justify-center">X</span> <span className="text-white/40">Có mặt</span></div>
                <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[8.5px] font-extrabold flex items-center justify-center">V</span> <span className="text-white/40">Vắng</span></div>
                <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border border-white/20 bg-white/5 text-white/50 text-[8.5px] font-extrabold flex items-center justify-center">P</span> <span className="text-white/40">Phép</span></div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-white/30 font-extrabold uppercase text-[10px]">
                    <th className="pb-3 w-[240px]">Họ tên nghệ nhân</th>
                    <th className="pb-3 text-center">T15 (5/5)</th>
                    <th className="pb-3 text-center">T16 (6/5)</th>
                    <th className="pb-3 text-center">T17 (7/5)</th>
                    <th className="pb-3 text-center">T18 (8/5)</th>
                    <th className="pb-3 text-center">T19 (9/5)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {attendance.map((row) => (
                    <tr key={row.name}>
                      <td className="py-3 font-bold text-white/90">{row.name}</td>
                      {row.days.map((day, idx) => {
                        let btnStyle = "border-white/20 bg-white/5 text-white/50";
                        if (day === "X") btnStyle = "border-green-500/30 bg-green-500/10 text-green-400";
                        if (day === "V") btnStyle = "border-amber-500/30 bg-amber-500/10 text-amber-400";

                        return (
                          <td key={idx} className="py-3 text-center">
                            <button
                              onClick={() => cycleAttendance(row.name, idx)}
                              className={`w-6 h-6 rounded-full border text-[10px] font-extrabold transition-all inline-flex items-center justify-center ${btnStyle}`}
                            >
                              {day}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* BÊN PHẢI (1/3): Phân quyền nghiệp vụ */}
        <div className="bg-[#13181f] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-[14px] font-extrabold text-white flex items-center gap-2">
              Phân Quyền Nghiệp Vụ
            </h3>
            <p className="text-[11px] text-white/35 mt-1.5 leading-relaxed">
              Xem và thay đổi quyền hạn của từng vị trí trong quán. Click vào các checkbox để tăng giảm quyền hạn <span className="text-amber-500/80 font-bold">(Chỉ tài khoản Admin: Nguyễn Minh Hoàng)</span>.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {staffList.map((s) => (
              <div key={s.id} className="p-3.5 bg-[#0d1117] border border-white/[0.06] rounded-xl space-y-3">
                
                {/* Mini Profile Header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-[11.5px] font-extrabold text-white leading-none">{s.name}</h5>
                    <p className="text-[9px] font-bold text-amber-500/80 mt-1 uppercase tracking-wider">{s.role}</p>
                  </div>
                </div>

                {/* Checklist options */}
                <div className="space-y-2 text-[11.5px] text-white/60">
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={s.permissions.pos}
                      onChange={() => handlePermissionToggle(s.id, "pos")}
                      className="accent-amber-400 w-3.5 h-3.5 rounded-sm bg-transparent border-white/20"
                    />
                    <span>Quyền vào POS</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={s.permissions.inventory}
                      onChange={() => handlePermissionToggle(s.id, "inventory")}
                      className="accent-amber-400 w-3.5 h-3.5 rounded-sm bg-transparent border-white/20"
                    />
                    <span>Quản lý kho</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={s.permissions.reports}
                      onChange={() => handlePermissionToggle(s.id, "reports")}
                      className="accent-amber-400 w-3.5 h-3.5 rounded-sm bg-transparent border-white/20"
                    />
                    <span>Xem báo cáo hành chính</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reservations;
