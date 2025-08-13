// GitHub Gist 文件类型
export interface GistFile {
  filename: string;
  type: string;
  language: string | null;
  raw_url: string;
  size: number;
  truncated: boolean;
  content: string;
}

// GitHub Gist 类型
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

// 更新 Gist 的请求类型
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