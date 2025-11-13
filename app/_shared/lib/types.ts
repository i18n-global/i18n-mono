// Shared types for the application

export interface ProjectSubmission {
  id?: string;
  url: string;
  projectName?: string;
  autoTitle?: string;
  autoDescription?: string;
  thumbnailUrl?: string;
  screenshotUrl?: string;
  contactEmail?: string;
  approved: boolean;
  submittedAt?: string;
}

export interface DownloadStats {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export interface MetadataResponse {
  title: string;
  description: string;
  thumbnailUrl: string;
  screenshotUrl?: string;
  error?: string;
}
