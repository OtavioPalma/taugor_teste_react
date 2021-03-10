export interface Activity {
  id: string;
  title: string;
  description: string;
  status: string;
  user: string;
  events: ActivityEvent[];
}

interface ActivityEvent {
  type: 'create' | 'edit-status' | 'edit-user';
  created: Date;
}
