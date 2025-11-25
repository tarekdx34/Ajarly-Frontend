// src/components/dashboard/admin/users/UserRow.tsx
import { Eye, UserX, UserCheck, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { TableCell, TableRow } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import type { UserProfile } from "../../../../api";

interface UserRowProps {
  user: UserProfile;
  formatDate: (date: string) => string;
  getStatusColor: (status: string | boolean) => string;
  onBan: (userId: number, userName: string) => void;
  onUnban: (userId: number, userName: string) => void;
}

export function UserRow({
  user,
  formatDate,
  getStatusColor,
  onBan,
  onUnban,
}: UserRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.profilePhoto} />
            <AvatarFallback className="bg-[#00BFA6] text-white">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{user.userType}</Badge>
      </TableCell>
      <TableCell>{formatDate(user.createdAt)}</TableCell>
      <TableCell>
        <Badge
          className={getStatusColor(user.isActive ? "active" : "suspended")}
        >
          {user.isActive ? "Active" : "Banned"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {user.emailVerified && (
            <Badge className="bg-blue-100 text-blue-700">Email ✓</Badge>
          )}
          {user.phoneVerified && (
            <Badge className="bg-green-100 text-green-700">Phone ✓</Badge>
          )}
          {user.nationalIdVerified && (
            <Badge className="bg-purple-100 text-purple-700">ID ✓</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {user.isActive ? (
              <DropdownMenuItem
                onClick={() =>
                  onBan(user.userId, `${user.firstName} ${user.lastName}`)
                }
              >
                <UserX className="w-4 h-4 mr-2" />
                Ban User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() =>
                  onUnban(user.userId, `${user.firstName} ${user.lastName}`)
                }
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Unban User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
