export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
}

export interface Metric {
  nb_hits?: number;
  nb_uniq_visitors?: number;
  nb_visits?: number;
  views?: number;
  followers?: number;
  reuses?: number;
  downloads?: number;
}

export interface Resource {
  id: string;
  title: string;
  format: string;
  url: string;
  created_at: string;
  filesize?: number;
  type?: string;
}

export interface Dataset {
  id: string;
  title: string;
  slug: string;
  description: string;
  organization: Organization | null;
  last_modified: string;
  created_at: string;
  tags: string[];
  resources: Resource[];
  metrics: Metric;
  page: string; // The URL to the dataset page usually
}

export interface Reuse {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  image: string | null;
  image_thumbnail: string | null;
  organization: Organization | null;
  created_at: string;
  last_modified: string;
  metrics: Metric;
  url: string;
  tags: string[];
  datasets?: Dataset[];
}

export interface SiteInfo {
  id: string;
  title?: string;
  metrics: {
    datasets: number;
    organizations: number;
    reuses: number;
    users: number;
  };
}

export interface Post {
  id: string;
  name: string;
  slug: string;
  headline: string;
  content: string;
  body_type: string;
  image: string | null;
  image_thumbnail: string | null;
  created_at: string;
  last_modified: string;
  tags: string[];
}

export interface GlobalSearchSuggestion {
  title: string;
  slug: string;
  score: number;
}

export interface DatasetSuggestion {
  id: string;
  title: string;
  slug: string;
  acronym: string | null;
  image_url: string | null;
  page: string;
}

export interface DiscussionUser {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  avatar: string | null;
  avatar_thumbnail: string | null;
  page: string;
  uri: string;
}

export interface DiscussionMessage {
  content: string;
  posted_by: DiscussionUser;
  posted_by_organization: unknown | null;
  posted_on: string;
  last_modified_at: string | null;
  permissions: {
    delete: boolean;
    edit: boolean;
  };
  spam: {
    status: string | null;
  };
}

export interface Discussion {
  id: string;
  title: string;
  url: string;
  created: string;
  closed: string | null;
  closed_by: DiscussionUser | null;
  closed_by_organization: unknown | null;
  subject: {
    class: string;
    id: string;
  };
  user: DiscussionUser;
  discussion: DiscussionMessage[];
  organization: unknown | null;
  permissions: {
    close: boolean;
    delete: boolean;
    edit: boolean;
  };
  spam: {
    status: string | null;
  };
  extras: Record<string, unknown>;
}

export interface DiscussionCreatePayload {
  title: string;
  comment: string;
  subject: {
    class: string;
    id: string;
  };
}

export interface License {
  id: string;
  title: string;
  url: string | null;
  maintainer: string | null;
  flags: string[];
  alternate_titles: string[];
  alternate_urls: string[];
}

export interface Frequency {
  id: string;
  label: string;
}

export interface DatasetBadges {
  [key: string]: string;
}

export interface TagSuggestion {
  text: string;
}

export interface FormatSuggestion {
  text: string;
}

export interface DatasetFilters {
  q?: string;
  tag?: string | string[];
  license?: string | string[];
  format?: string | string[];
  schema?: string;
  geozone?: string;
  granularity?: string;
  organization?: string | string[];
  badge?: string | string[];
  featured?: boolean;
  sort?: string;
}

export interface APIResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  next_page: string | null;
  previous_page: string | null;
}
