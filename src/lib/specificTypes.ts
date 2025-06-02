import { Student } from "./api";

export type LeaderboardUser = Pick<Student, "id" | "name" | "profile_pic_url" | "totalDistance" | "ride_count">;