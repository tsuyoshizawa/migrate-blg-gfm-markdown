export interface BacklogConfig {
  host: string;
  apiKey: string;
  projectCode: string;
  dryRun: boolean;
}

export interface ProcessingStats {
  total: number;
  updated: number;
  errors: number;
}

export interface MarkdownProcessResult {
  content: string;
  changed: boolean;
  changeCount: number;
}

export interface BacklogIssue {
  id: number;
  issueKey: string;
  summary: string;
  description: string;
}

export interface BacklogWiki {
  id: number;
  name: string;
  content: string;
}

export interface BacklogProject {
  id: number;
  projectKey: string;
  name: string;
  textFormattingRule: string;
}
