export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  full_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ShopDrawing {
  id: number;
  title: string;
  description?: string;
  drawing_number: string;
  revision?: string;
  status: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  uploaded_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface RFI {
  id: number;
  rfi_number: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  requested_by?: number;
  assigned_to?: number;
  due_date?: Date;
  response?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RFIAttachment {
  id: number;
  rfi_id: number;
  file_path: string;
  file_name: string;
  file_size?: number;
  uploaded_at: Date;
}

export interface MeetingMinute {
  id: number;
  meeting_number: string;
  title: string;
  meeting_date: Date;
  location?: string;
  attendees?: string;
  agenda?: string;
  discussion?: string;
  decisions?: string;
  action_items?: string;
  next_meeting?: Date;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface MeetingAttachment {
  id: number;
  meeting_id: number;
  file_path: string;
  file_name: string;
  file_size?: number;
  uploaded_at: Date;
}

export interface Engineer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  company?: string;
  contract_start_date?: Date;
  contract_end_date?: Date;
  status: string;
  hourly_rate?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: Date;
  assigned_to?: number;
  shop_drawing_id?: number;
  rfi_id?: number;
  meeting_id?: number;
  engineer_id?: number;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: number;
  is_read: boolean;
  created_at: Date;
}

export interface Comment {
  id: number;
  entity_type: string;
  entity_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  changes?: string;
  created_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: User;
}
