export type AttendanceType = "CheckIn" | "CheckOut";

export interface TimestampEntry {
  att_type: AttendanceType;
  date: string;
}

export interface AttendanceRecord {
  studentid: string;
  timestamps: TimestampEntry[];
  classname: string;
}
