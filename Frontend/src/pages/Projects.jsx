import { useState, useEffect } from "react";
import { getAllProjects, createProject } from "@/services/api/projectService";
import { getAllUsers } from "@/services/api/userService";
import { FolderKanban, Plus, X, Loader2, AlertCircle, CheckCircle2, Clock, Circle } from "lucide-react";
import toast from "react-hot-toast";
// ── Mock data cho dự án ──
const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý", icon: Circle, color: "text-yellow-400 bg-yellow-500/15" },
  { value: "in-progress", label: "Đang làm", icon: Clock, color: "text-blue-400 bg-blue-500/15" },
  { value: "completed", label: "Hoàn thành", icon: CheckCircle2, color: "text-green-400 bg-green-500/15" },
];
// ── Hàm hiển thị badge trạng thái dự án ──
const StatusBadge = ({ status }) => {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
  const Icon = opt.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${opt.color}`}>
      <Icon size={10} />
      {opt.label}
    </span>
  );
};

// --- Modal ---
const ProjectModal = ({ onClose, onSaved, users }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "pending",
    startDate: new Date().toISOString().split("T")[0],
    owner: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Tên dự án không được bỏ trống");
    if (!form.owner) return toast.error("Vui lòng chọn người phụ trách");
    try {
      setSaving(true);
      await createProject(form);
      toast.success("Tạo dự án thành công!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message ?? "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a2035] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-semibold text-white">Tạo dự án mới</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Tên dự án *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="VD: Website bán hàng" className={inputCls} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Mô tả ngắn về dự án..." rows={3}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Ngày bắt đầu</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputCls} />
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Người phụ trách *</label>
            <select name="owner" value={form.owner} onChange={handleChange} className={inputCls}>
              <option value="">-- Chọn người phụ trách --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-all">
              Hủy
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium transition-all disabled:opacity-50">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Tạo dự án
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page ---
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pData, uData] = await Promise.all([getAllProjects(), getAllUsers()]);
      setProjects(pData?.data ?? pData ?? []);
      setUsers(uData?.data ?? uData ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filterStatus === "all"
    ? projects
    : projects.filter((p) => p.status === filterStatus);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Dự Án</h2>
          <p className="text-xs text-white/40 mt-0.5">{projects.length} dự án trong hệ thống</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-xl transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Tạo dự án
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{ value: "all", label: "Tất cả" }, ...STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${filterStatus === f.value
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
              }`}
          >
            {f.label}
            <span className="ml-1.5 text-[10px] opacity-60">
              {f.value === "all" ? projects.length : projects.filter(p => p.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#161b27] border border-white/10 rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded-lg w-3/4" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30 bg-[#161b27] border border-white/10 rounded-2xl">
          <FolderKanban size={44} className="mb-3" />
          <p className="text-sm">Không có dự án nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div key={project._id}
              className="bg-[#161b27] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white text-sm leading-snug">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>

              {project.description && (
                <p className="text-xs text-white/40 line-clamp-2">{project.description}</p>
              )}

              <div className="mt-auto pt-3 border-t border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {(project.owner?.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-white/40 truncate max-w-[120px]">
                    {project.owner?.name ?? "N/A"}
                  </span>
                </div>
                <span className="text-[11px] text-white/30">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString("vi-VN")
                    : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          users={users}
          onClose={() => setShowModal(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
