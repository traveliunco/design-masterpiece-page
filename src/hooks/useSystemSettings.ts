import { useState, useEffect } from "react";
import { systemSettingsService, SystemSettings } from "@/services/adminDataService";

export const useSystemSettings = () => {
  const [sysSettings, setSysSettings] = useState<SystemSettings>(() => systemSettingsService.getSettings());

  useEffect(() => {
    // تحديث من نفس النافذة (عند الحفظ من لوحة التحكم)
    const handleLocalUpdate = (e: any) => {
      setSysSettings(e.detail);
    };

    // تحديث من نافذة أخرى (عبر localStorage)
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === "traveliun_system_settings") {
        setSysSettings(systemSettingsService.getSettings());
      }
    };

    window.addEventListener("system-settings-updated", handleLocalUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("system-settings-updated", handleLocalUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return sysSettings;
};
