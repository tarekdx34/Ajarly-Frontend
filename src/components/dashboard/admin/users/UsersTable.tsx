// src/components/dashboard/admin/users/UsersTable.tsx
import { Card } from "../../../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { UserRow } from "./UserRow";
import { Language, translations } from "../../../../lib/translations";
import type { UserProfile } from "../../../../../api";

interface UsersTableProps {
  users: UserProfile[];
  searchQuery: string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string | boolean) => string;
  onBan: (userId: number, userName: string) => void;
  onUnban: (userId: number, userName: string) => void;
  language: Language;
}

export function UsersTable({
  users,
  searchQuery,
  formatDate,
  getStatusColor,
  onBan,
  onUnban,
  language,
}: UsersTableProps) {
  const t = translations[language];

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.name || "User"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.role || "Type"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.joined || "Joined"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.status || "Status"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.verify || "Verified"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.actions || "Actions"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <UserRow
              key={user.userId}
              user={user}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              onBan={onBan}
              onUnban={onUnban}
              language={language}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
