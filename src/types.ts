export type LanguageCode =
  | 'as'   // Assamese (অসমীয়া)
  | 'brx'  // Bodo (बर')
  | 'mni'  // Meitei / Manipuri (মৈতৈলোন্)
  | 'lus'  // Mizo (Mizo ṭawng)
  | 'kha'  // Khasi (Ka Ktien Khasi)
  | 'grt'  // Garo (A·chik)
  | 'trp'  // Kokborok (Kokborok)
  | 'nag'  // Nagamese (Nagamese)
  | 'ne'   // Nepali (नेपाली - Sikkim & NE Hills)
  | 'hi'   // Hindi (हिन्दी)
  | 'en';  // English

export type GlobalLanguageCode = LanguageCode | 'es' | 'fr' | 'de' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  greeting: string;
  listenButtonText: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photoUrl: string;
  voiceNoteText?: string;
  hint: string;
  extendedFamily?: boolean;
  addedBy: 'caregiver' | 'system';
  addedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: 'medicine' | 'activity' | 'hydration' | 'meal' | 'voice';
  subtitle: string;
  time: string; // e.g. "09:30" or "9:30 AM"
  completed: boolean;
  recurrence: 'Daily' | 'Morning & Evening' | 'Weekly' | 'Once';
  voiceClipPath?: string;
  createdBy: 'caregiver' | 'patient';
  // Voice Reminder technical requirements
  audio_file_path?: string; // original recorded audio data URL/file path
  duration?: number; // duration in seconds
  scheduled_time?: string; // ISO datetime string for local alarm trigger
  status?: 'pending' | 'delivered' | 'snoozed';
  isVoiceReminder?: boolean;
}

export interface GameSession {
  id: string;
  gameId: string;
  gameTitle: string;
  level: 1 | 2 | 3;
  score: number; // normalized 0 - 100
  durationSeconds: number;
  hintsUsed: number;
  date: string; // ISO date string YYYY-MM-DD
  timestamp: number;
}

export interface DailyScore {
  date: string; // YYYY-MM-DD
  displayDate: string; // "Jul 15"
  averageScore: number;
  sessionsCount: number;
  baselineDiff?: number;
}

export type StoryCategory =
  | 'Historical Fiction / Folk-History'
  | 'Atmospheric Mystery / Thriller'
  | 'Heartwarming & Emotional'
  | 'Folk-Wisdom';

export interface Story {
  id: string;
  title: string;
  category: StoryCategory;
  regionState: string;
  district: string;
  language: LanguageCode;
  durationMinutes: number;
  coverImage: string;
  tags: string[];
  synopsis: string;
  fullScript: string;
}

export interface CaregiverAlert {
  id: string;
  tier: 'gentle' | 'medium' | 'high';
  title: string;
  description: string;
  date: string;
  acknowledged: boolean;
  suggestedAction: string;
}

export interface CareCircleMember {
  id: string;
  name: string;
  relationship: string;
  role: 'Primary Caregiver' | 'Family' | 'ASHA Worker' | 'Physician';
  phone: string;
  avatarUrl?: string;
  lastActive: string;
}

export interface CaregiverNote {
  id: string;
  fromName: string;
  relation: string;
  message: string;
  timestamp: string;
  audioNote?: string;
}

export interface SyncQueueItem {
  id: string;
  action: string;
  entity: string;
  payload: any;
  createdAt: number;
  status: 'pending' | 'synced';
}

export interface UserProfile {
  id: string;
  elderName: string;
  preferredName: string; // e.g. "Aita", "Maa", "Amma", "Dadi"
  phone: string;
  email?: string;
  pin: string;
  age?: number;
  stateRegion: string;
  districtArea: string;
  language: LanguageCode | string;
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelation: string;
  caregiverPhoto?: string;
  familyMemberName: string;
  familyMemberPhone: string;
  familyMemberRelation: string;
  createdAt: string;
}
