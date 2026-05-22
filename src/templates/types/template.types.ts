export type GitHubLabel = {
  name: string;
  color: string;
  description?: string;
};

export type GitHubTemplateGroup = {
  group: string;
  labels: GitHubLabel[];
};

export type GitHubLabelTemplate = {
  version: string;
  templates: GitHubTemplateGroup[];
};