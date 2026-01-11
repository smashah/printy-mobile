export interface IssueData {
  title: string;
  number: string | number;
  status?: string;
  statusDitheredBackground?: string;
  author?: string;
  repo?: string;
  url: string;
  createdAt?: string;
  labels?: { name: string; color: string; ditheredBackground?: string }[];
  assignees?: { login: string; avatarUrl: string }[];
  commentsCount?: number;
  reactions?: {
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  body?: string;
  authorAvatarUrl?: string;
  qrCodeDataUrl?: string;
}

export interface RecipeData {
  title: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  cookware: { name: string }[];
  steps: string[];
  metadata?: Record<string, string>;
  image?: string;
}

export interface ColoringPageData {
  title: string;
  imageUrl: string;
  description: string;
  suggestedColors: string[];
}

export interface PullRequestData {
  title: string;
  number: number | string;
  status: "open" | "closed" | "merged";
  sourceBranch: string;
  targetBranch: string;
  additions: number;
  deletions: number;
  author: string;
  authorAvatarUrl?: string;
  reviewers: Array<{
    login: string;
    avatarUrl: string;
  }>;
  ciStatus: "passing" | "failing" | "pending";
  url: string;
  qrCodeDataUrl?: string;
}

export interface ReleaseData {
  version: string;
  commitHash: string;
  deployer: string;
  deploymentTime: string;
  releaseNotesUrl: string;
  qrCodeDataUrl?: string;
}

export interface BuildData {
  buildId: string;
  status: "success" | "failure" | "running";
  duration: number;
  startTime: string;
  endTime?: string;
  stages: Array<{
    name: string;
    status: "success" | "failure" | "running" | "skipped";
    duration?: number;
  }>;
  errorLog?: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  security: "WPA2" | "WPA3" | "WEP" | "Open";
  qrCodeDataUrl: string;
}

export interface AssetData {
  companyName: string;
  deviceName: string;
  deviceModel: string;
  assetId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  qrCodeDataUrl?: string;
  barcodeDataUrl?: string;
}

export interface TodoData {
  date: string;
  tasks: (string | { text: string; completed?: boolean })[];
  notes?: string;
}
