export interface UserRef {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  avatar_thumbnail: string | null;
  uri: string;
  page: string;
  saml_login?: boolean;
}

export interface OrganizationMember {
  user: UserRef;
  role: string;
  since: string;
}

export interface Badge {
  kind: string;
}

export interface OrganizationMetrics {
  datasets: number;
  dataservices: number;
  followers: number;
  members: number;
  reuses: number;
  views: number;
}

export interface Organization {
  id: string;
  name: string;
  acronym: string | null;
  slug: string;
  logo: string | null;
  logo_thumbnail: string | null;
  description: string | null;
  url: string | null;
  business_number_id: string | null;
  members: OrganizationMember[];
  badges: Badge[];
  metrics: OrganizationMetrics;
  created_at: string;
  last_modified: string;
  page: string;
  uri: string;
}

export interface OrganizationSuggestion {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  score: number;
}

export interface OrgBadges {
  [kind: string]: string;
}

export interface OrganizationFilters {
  q?: string;
  badge?: string;
  sort?: string;
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

export interface DatasetRef {
  id: string;
  title: string;
  page: string;
  uri: string;
}

export interface ReuseType {
  id: string;
  label: string;
}

export interface ReuseSuggestion {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  score: number;
}

export interface ReuseFilters {
  q?: string;
  type?: string;
  tag?: string;
  organization?: string;
  sort?: string;
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
  owner: UserRef | null;
  created_at: string;
  last_modified: string;
  metrics: Metric;
  url: string;
  tags: string[];
  badges: Badge[];
  datasets: DatasetRef[];
  dataservices: Dataservice[];
}

export interface Dataservice {
  id: string;
  title: string;
  acronym: string | null;
  slug: string;
  description: string;
  base_api_url: string | null;
  format: string | null;
  organization: Organization | null;
  created_at: string;
  last_modified: string;
  metrics: Metric;
  tags: string[];
  private: boolean;
}

export interface SiteMetrics {
  datasets: number;
  dataservices?: number;
  organizations: number;
  reuses: number;
  users: number;
}

export interface SiteInfo {
  id: string;
  title?: string;
  metrics: SiteMetrics;
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

export interface DiscussionMessage {
  content: string;
  posted_by: UserRef;
  posted_on: string;
}

export interface Discussion {
  id: string;
  title: string;
  user: UserRef;
  created: string;
  closed: string | null;
  closed_by: UserRef | null;
  discussion: DiscussionMessage[];
  url: string;
}

export interface TopicElementsLink {
  rel: string;
  href: string;
  type: string;
  total: number;
}

export interface TopicSpatialCoverage {
  geom: object | null;
  zones: string[];
  granularity: string | null;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  elements: TopicElementsLink;
  featured: boolean;
  private: boolean;
  created_at: string;
  last_modified: string;
  spatial: TopicSpatialCoverage | null;
  organization: Organization | null;
  owner: UserRef | null;
  uri: string;
  extras: Record<string, unknown> | null;
}

export interface TopicElementRef {
  class: "Dataset" | "Reuse" | "Dataservice";
  id: string;
}

export interface TopicElement {
  id: string;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  extras: Record<string, unknown> | null;
  element: TopicElementRef | null;
}

export interface APIResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  next_page: string | null;
  previous_page: string | null;
}
