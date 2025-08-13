// 剪贴板项目类型
export interface ClipboardItem {
  id: string;
  content: string;
  timestamp: string;
  copied: boolean;
}

// Gist 相关类型
export interface GistFile {
  filename: string;
  type: string;
  language: string | null;
  raw_url: string;
  size: number;
  truncated: boolean;
  content: string;
}

export interface Gist {
  url: string;
  forks_url: string;
  commits_url: string;
  id: string;
  node_id: string;
  git_pull_url: string;
  git_push_url: string;
  html_url: string;
  files: Record<string, GistFile>;
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string | null;
  comments: number;
  user: any;
  truncated: boolean;
}

export interface UpdateGistRequest {
  description?: string;
  files?: Record<string, {
    content?: string;
    filename?: string;
  } | null>;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// 错误响应类型
export interface ApiError {
  message: string;
  status: number;
  statusText: string;
}

// 加载状态类型
export interface LoadingState {
  loading: boolean;
  error: string;
}

// 分页类型
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
} 