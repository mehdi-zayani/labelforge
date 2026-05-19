export type LabelTemplate = {
  name: string;
  color: string;
  description?: string;
};

export type TemplateGroup = {
  group: string;
  labels: LabelTemplate[];
};

export type GitHubLabelTemplate = {
  version: string;
  templates: TemplateGroup[];
};