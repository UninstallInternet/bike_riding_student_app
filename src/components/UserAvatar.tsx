import { Avatar } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchStudents } from "../lib/api";

export const UserAvatar = () => {
  const { session } = UserAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents().then((students) => {
      const currentUser = students.find(
        (student: { id: string; profile_pic_url?: string }) =>
          student.id === session?.user?.id
      );

      setProfilePic(currentUser?.profile_pic_url || null);
    });
  }, [session]);

  return <Avatar src={profilePic || undefined} />;
};
