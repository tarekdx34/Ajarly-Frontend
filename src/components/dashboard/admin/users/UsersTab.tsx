// src/components/dashboard/admin/users/UsersTab.tsx
import { useState } from "react";
import { SearchBar } from "../shared/SearchBar";
import { UsersTable } from "./UsersTable";
import { Language, translations } from "../../../../lib/translations";
import type { UserProfile } from "../../../../../api";

interface UsersTabProps {
  users: UserProfile[];
  formatDate: (date: string) => string;
  getStatusColor: (status: string | boolean) => string;
  onBan: (userId: number, userName: string) => void;
  onUnban: (userId: number, userName: string) => void;
  language: Language;
}

export function UsersTab({
  users,
  formatDate,
  getStatusColor,
  onBan,
  onUnban,
  language,
}: UsersTabProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={`flex items-center justify-between ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] ${
            language === "ar" ? "text-right" : ""
          }`}
        >
          {t.admin?.manageUsers || "Manage Users"} ({users.length})
        </h2>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.admin?.searchUsers || "Search users..."}
        />
      </div>

      <UsersTable
        users={users}
        searchQuery={searchQuery}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        onBan={onBan}
        onUnban={onUnban}
        language={language}
      />
    </div>
  );
}
