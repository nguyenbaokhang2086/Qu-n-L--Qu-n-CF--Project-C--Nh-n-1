import { useState, useEffect } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/services/api/userService";
import { Users, Plus, Pencil, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

// --- Modal Form ---
const UserModal = ({ user, onClose, onSaved }) => {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    age: user?.age ?? 18,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "age" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return toast.error("Vui lòng điền đầy đủ thông tin");
    try {
      setSaving(true);
      if (isEdit) {
        await updateUser(user._id, form);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await createUser(form);
        toast.success("Thêm người dùng thành công!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message ?? "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a2035] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-semibold text-white">{isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Họ và tên *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Tuổi</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min={1}
              max={120}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page ---
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | 'add' | User object
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data?.data ?? data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      setDeletingId(id);
      await deleteUser(id);
      toast.success("Đã xóa người dùng");
      fetchData();
    } catch (err) {
      toast.error(err.message ?? "Xóa thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Người Dùng</h2>
          <p className="text-xs text-white/40 mt-0.5">Quản lý toàn bộ tài khoản trong hệ thống</p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-xl transition-all"
        >
          <Plus size={16} />
          Thêm người dùng
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Table card */}
      <div className="bg-[#161b27] border border-white/10 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/40 uppercase tracking-wide">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Họ tên</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-1">Tuổi</div>
          <div className="col-span-2 text-right">Hành động</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="space-y-px">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5">
                {[1, 4, 4, 1, 2].map((span, j) => (
                  <div key={j} className={`col-span-${span} h-4 bg-white/10 rounded-lg animate-pulse`} />
                ))}
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <Users size={40} className="mb-3" />
            <p className="text-sm">Chưa có người dùng nào</p>
            <button onClick={() => setModal("add")} className="mt-3 text-xs text-amber-400 hover:underline">
              + Thêm người dùng đầu tiên
            </button>
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user._id}
              className="grid grid-cols-12 gap-4 items-center px-5 py-4 border-b border-white/5 hover:bg-white/[0.03] transition-all"
            >
              <div className="col-span-1 text-xs text-white/30">{index + 1}</div>
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <span className="text-sm font-medium text-white truncate">{user.name}</span>
              </div>
              <div className="col-span-4 text-sm text-white/50 truncate">{user.email}</div>
              <div className="col-span-1 text-sm text-white/50">{user.age}</div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setModal(user)}
                  className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-all"
                  title="Chỉnh sửa"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  disabled={deletingId === user._id}
                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all disabled:opacity-40"
                  title="Xóa"
                >
                  {deletingId === user._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <UserModal
          user={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
};

export default UsersPage;
