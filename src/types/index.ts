import type { Timestamp } from 'firebase/firestore';

/** Fecha tal como puede llegar desde Firestore o desde el cliente. */
export type FireDate = Timestamp | Date | string | null;

export type UserRole = 'user' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type CommunityStatus =
  | 'waiting'
  | 'verifying'
  | 'approved'
  | 'in_progress'
  | 'completed';

export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type ImprovementStatus = 'pending' | 'in_progress' | 'completed';

/** Areas de mejora que el propietario elige una unica vez. */
export const IMPROVEMENT_AREAS = [
  'administracion',
  'organizacion',
  'crecimiento',
  'diseno',
  'automatizacion',
  'moderacion',
  'actividades',
] as const;

export type ImprovementArea = (typeof IMPROVEMENT_AREAS)[number];

export const IMPROVEMENT_AREA_LABELS: Record<ImprovementArea, string> = {
  administracion: 'Administración',
  organizacion: 'Organización',
  crecimiento: 'Crecimiento',
  diseno: 'Diseño',
  automatizacion: 'Automatización',
  moderacion: 'Moderación',
  actividades: 'Actividades',
};

export interface AppUser {
  uid: string;
  nick: string;
  email: string;
  whatsapp: string;
  role: UserRole;
  status: UserStatus;
  photoUrl?: string;
  createdAt: FireDate;
}

export interface Community {
  id: string;
  ownerUid: string;
  /** Copia del nick del dueno para poder mostrarlo en la lista publica. */
  ownerNick: string;
  communityName: string;
  isAdminVerified: boolean;
  status: CommunityStatus;
  selectedImprovements: ImprovementArea[];
  /** Promedio de avance de las tareas, 0 a 100. Lo recalcula el equipo. */
  progress: number;
  logoUrl?: string;
  createdAt: FireDate;
}

export interface SupportRequest {
  id: string;
  userId: string;
  communityId: string;
  status: RequestStatus;
  notes: string;
  createdAt: FireDate;
}

export interface Improvement {
  id: string;
  communityId: string;
  title: string;
  description: string;
  /** 0 a 100 */
  progress: number;
  status: ImprovementStatus;
  /** Responsable dentro del equipo de Argyra. */
  assignedTo: string;
  updatedAt?: FireDate;
}

export interface PlatformStats {
  registeredUsers: number;
  approvedCommunities: number;
  waitingCommunities: number;
  inProgressCommunities: number;
  completedCommunities: number;
  pendingRequests: number;
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
};

export const IMPROVEMENT_STATUS_LABELS: Record<ImprovementStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  completed: 'Completada',
};

export const COMMUNITY_STATUS_LABELS: Record<CommunityStatus, string> = {
  waiting: 'En espera',
  verifying: 'Verificando',
  approved: 'Aprobada',
  in_progress: 'En proceso',
  completed: 'Finalizada',
};
