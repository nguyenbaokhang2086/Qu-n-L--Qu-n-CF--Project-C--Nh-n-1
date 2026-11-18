import { Settings as SettingsIcon, Moon, Bell, Globe, Shield } from "lucide-react";
import { usePersistentState } from "../hooks/usePersistentState";

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/[0.07] last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-amber-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
  </label>
);

const Settings = () => {
  const [preferences, setPreferences] = usePersistentState("artisan.settings", {
    language: "vi",
    darkMode: true,
    systemNotifications: true,
    emailNotifications: false,
    twoFactorAuth: false,
    autoLogout: true,
  });
  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Cài Đặt</h2>
        <p className="text-xs text-white/40 mt-0.5">Tùy chỉnh giao diện và hệ thống</p>
      </div>

      {/* General */}
      <div className="bg-[#161b27] border border-white/10 rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Tổng quan</h3>
        <SettingRow icon={Globe} title="Ngôn ngữ" description="Ngôn ngữ hiển thị giao diện">
          <select
            value={preferences.language}
            onChange={(event) => updatePreference("language", event.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </SettingRow>
        <SettingRow icon={Moon} title="Giao diện tối" description="Sử dụng dark mode cho toàn bộ ứng dụng">
          <Toggle checked={preferences.darkMode} onChange={(event) => updatePreference("darkMode", event.target.checked)} />
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="bg-[#161b27] border border-white/10 rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Thông báo</h3>
        <SettingRow icon={Bell} title="Thông báo hệ thống" description="Nhận thông báo khi có cập nhật mới">
          <Toggle checked={preferences.systemNotifications} onChange={(event) => updatePreference("systemNotifications", event.target.checked)} />
        </SettingRow>
        <SettingRow icon={Bell} title="Email thông báo" description="Gửi email khi dự án thay đổi trạng thái">
          <Toggle checked={preferences.emailNotifications} onChange={(event) => updatePreference("emailNotifications", event.target.checked)} />
        </SettingRow>
      </div>

      {/* Security */}
      <div className="bg-[#161b27] border border-white/10 rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Bảo mật</h3>
        <SettingRow icon={Shield} title="Xác thực 2 bước" description="Tăng cường bảo mật tài khoản">
          <Toggle checked={preferences.twoFactorAuth} onChange={(event) => updatePreference("twoFactorAuth", event.target.checked)} />
        </SettingRow>
        <SettingRow icon={SettingsIcon} title="Phiên đăng nhập" description="Tự động đăng xuất sau 30 ngày không hoạt động">
          <Toggle checked={preferences.autoLogout} onChange={(event) => updatePreference("autoLogout", event.target.checked)} />
        </SettingRow>
      </div>

      {/* API Info */}
      <div className="bg-[#161b27] border border-white/10 rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Thông tin API</h3>
        <div className="space-y-2">
          {[
            { label: "Base URL", value: import.meta.env.VITE_API_URL || "Chưa cấu hình" },
            { label: "Phiên bản", value: "v1.0.0" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <span className="text-xs text-white/40">{label}</span>
              <code className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">{value}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
