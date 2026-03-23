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
  roles?: string[];
  organizations?: Organization[];
  last_modified?: string;
}

export interface UserMetrics {
  datasets: number;
  followers: number;
  reuses: number;
  views: number;
  downloads: number;
}

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  about?: string;
  website?: string;
}

export interface OrgInvitation {
  id: string;
  organization: Organization | null;
  status: "pending" | "accepted" | "refused";
  created: string;
}

export interface UserPublic {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  email: string | null;
  avatar: string | null;
  avatar_thumbnail: string | null;
  website: string | null;
  about: string | null;
  roles: string[];
  active: boolean;
  organizations: Organization[];
  since: string;
  uri: string;
  page: string;
  metrics: UserMetrics;
  apikey: string | null;
}

export interface OrganizationMember {
  user: UserRef;
  role: string;
  label?: string;
  since: string;
}

export interface MembershipRequest {
  id: string;
  user: UserRef;
  created: string;
  status: "pending" | "accepted" | "refused";
  comment: string;
}

export interface OrgRole {
  id: string;
  label: string;
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

export interface OrganizationCreatePayload {
  name: string;
  acronym?: string;
  description?: string;
  url?: string;
  business_number_id?: string;
}

export interface OrganizationUpdatePayload {
  name?: string;
  acronym?: string;
  description?: string;
  url?: string;
  business_number_id?: string;
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
  resources_downloads?: number;
  discussions?: number;
}

export interface Checksum {
  type: string;
  value: string;
}

export interface SchemaRef {
  name: string | null;
  version: string | null;
  url: string | null;
}

export interface TemporalCoverage {
  start: string;
  end?: string;
}

export interface SpatialCoverage {
  geom: object | null;
  zones: string[];
  granularity: string | null;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  format: string;
  url: string;
  latest?: string;
  filetype?: string;
  type?: string;
  mime?: string;
  filesize?: number;
  checksum?: Checksum | null;
  created_at: string;
  last_modified?: string;
  schema?: SchemaRef | null;
  metrics?: Record<string, number>;
  extras?: Record<string, unknown>;
  preview_url?: string;
}

export interface ResourceCreatePayload {
  title: string;
  description?: string;
  type: string;
  url: string;
  filetype: string;
  format: string;
}

export interface ResourceUpdatePayload {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  filetype?: string;
  format?: string;
}

export interface DatasetPermissions {
  delete: boolean;
  edit: boolean;
  edit_resources: boolean;
}

export interface DatasetQuality {
  all_resources_available: boolean;
  dataset_description_quality: boolean;
  has_open_format: boolean;
  has_resources: boolean;
  license: boolean;
  resources_documentation: boolean;
  score: number;
  spatial: boolean;
  temporal_coverage: boolean;
  update_frequency: boolean;
  update_fulfilled_in_time: boolean;
}

export interface Dataset {
  id: string;
  title: string;
  acronym: string | null;
  slug: string;
  description: string;
  description_short?: string | null;
  organization: Organization | null;
  owner: UserRef | null;
  license: string | null;
  frequency: string;
  frequency_date?: string | null;
  temporal_coverage?: TemporalCoverage | null;
  spatial?: SpatialCoverage | null;
  schema?: SchemaRef | null;
  private: boolean;
  featured: boolean;
  archived?: string | null;
  deleted?: string | null;
  last_modified: string;
  last_update?: string;
  created_at: string;
  tags: string[];
  resources: Resource[];
  community_resources?: Resource[];
  badges: Badge[];
  metrics: Metric;
  quality?: DatasetQuality;
  extras?: Record<string, unknown>;
  harvest?: Record<string, unknown> | null;
  uri: string;
  page: string;
  permissions?: DatasetPermissions;
}

export interface DatasetCreatePayload {
  title: string;
  description: string;
  description_short?: string;
  acronym?: string;
  tags?: string[];
  license?: string;
  frequency?: string;
  frequency_date?: string;
  temporal_coverage?: TemporalCoverage;
  spatial?: SpatialCoverage;
  private?: boolean;
  organization?: string;
  extras?: Record<string, unknown>;
}

export interface DatasetUpdatePayload {
  title?: string;
  description?: string;
  description_short?: string;
  acronym?: string;
  tags?: string[];
  license?: string;
  frequency?: string;
  frequency_date?: string;
  temporal_coverage?: TemporalCoverage;
  spatial?: SpatialCoverage;
  private?: boolean;
  archived?: string;
  organization?: string;
  extras?: Record<string, unknown>;
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
  dataset?: string;
  sort?: string;
}

export interface ReuseTopic {
  id: string;
  label: string;
}

export interface Reuse {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  url: string;
  image: string | null;
  image_thumbnail: string | null;
  organization: Organization | null;
  owner: UserRef | null;
  private: boolean;
  featured: boolean;
  archived: string | null;
  topic: string | null;
  created_at: string;
  last_modified: string;
  metrics: Metric;
  tags: string[];
  badges: Badge[];
  datasets: DatasetRef[];
  dataservices: Dataservice[];
}

export interface ReuseCreatePayload {
  title: string;
  description: string;
  url: string;
  type: string;
  topic?: string;
  tags?: string[];
  organization?: string;
  private?: boolean;
}

export interface ReuseUpdatePayload {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  topic?: string;
  tags?: string[];
  organization?: string;
  private?: boolean;
}

export interface Dataservice {
  id: string;
  title: string;
  acronym: string | null;
  slug: string;
  description: string;
  base_api_url: string | null;
  machine_documentation_url: string | null;
  technical_documentation_url: string | null;
  business_documentation_url: string | null;
  authorization_request_url: string | null;
  rate_limiting: string | null;
  rate_limiting_url: string | null;
  availability: number | null;
  availability_url: string | null;
  access_type: string | null;
  format: string | null;
  license: string | null;
  organization: Organization | null;
  owner: UserRef | null;
  created_at: string;
  last_modified: string;
  archived: string | null;
  deleted: string | null;
  metrics: Metric;
  tags: string[];
  private: boolean;
  featured: boolean;
  datasets: DatasetRef[];
}

export interface DataserviceCreatePayload {
  title: string;
  description: string;
  acronym?: string;
  base_api_url?: string;
  machine_documentation_url?: string;
  technical_documentation_url?: string;
  business_documentation_url?: string;
  authorization_request_url?: string;
  rate_limiting?: string;
  availability?: number;
  access_type?: string;
  format?: string;
  license?: string;
  tags?: string[];
  organization?: string;
  private?: boolean;
  datasets?: string[];
}

export interface DataserviceUpdatePayload {
  title?: string;
  description?: string;
  acronym?: string;
  base_api_url?: string;
  machine_documentation_url?: string;
  technical_documentation_url?: string;
  business_documentation_url?: string;
  authorization_request_url?: string;
  rate_limiting?: string;
  availability?: number;
  access_type?: string;
  format?: string;
  license?: string;
  tags?: string[];
  organization?: string;
  private?: boolean;
  archived?: string;
  datasets?: string[];
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

export interface SiteConfigUpdatePayload {
  title?: string;
  [key: string]: unknown;
}

export interface Post {
  id: string;
  name: string;
  slug: string;
  headline: string;
  content: string;
  body_type: string;
  kind: string;
  published: string | null;
  owner: UserRef | null;
  image: string | null;
  image_thumbnail: string | null;
  credit_to: string | null;
  credit_url: string | null;
  created_at: string;
  last_modified: string;
  tags: string[];
}

export interface PostCreatePayload {
  name: string;
  headline?: string;
  content?: string;
  body_type?: string;
  kind?: string;
  published?: string;
  tags?: string[];
  credit_to?: string;
  credit_url?: string;
}

export interface PostUpdatePayload {
  name?: string;
  headline?: string;
  content?: string;
  body_type?: string;
  kind?: string;
  published?: string;
  tags?: string[];
  credit_to?: string;
  credit_url?: string;
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

export interface ResourceType {
  id: string;
  label: string;
}

export interface CatalogSchema {
  name: string;
  title: string;
  description: string;
  schema_url: string;
  schema_type: string;
  contact: string;
}

export interface Activity {
  actor: UserRef;
  organization: Organization | null;
  related_to: string;
  related_to_id: string;
  related_to_kind: string;
  related_to_url: string;
  created_at: string;
  label: string;
  key: string;
  icon: string;
  changes: string[];
  extras: Record<string, unknown>;
}

export interface TagSuggestion {
  text: string;
}

export interface FormatSuggestion {
  text: string;
}

export interface SpatialZone {
  id: string;
  name: string;
  code: string;
  level: string;
  uri: string;
}

export interface Granularity {
  id: string;
  name: string;
}

export interface GeoLevel {
  id: string;
  name: string;
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
  datasets_count: number;
  reuses_count: number;
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

export interface TopicCreatePayload {
  name: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  private?: boolean;
}

export interface TopicUpdatePayload {
  name?: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  private?: boolean;
}

export interface TopicElementCreatePayload {
  class: "Dataset" | "Reuse" | "Dataservice";
  id: string;
}

export interface DiscussionNotificationDetails {
  discussion: string | null;
  status: string | null;
  message_id: string | null;
}

export interface MembershipRequestNotificationDetails {
  request_organization: Organization | null;
  request_user: UserRef | null;
}

export interface TransferRequestNotificationDetails {
  transfer_owner: object | null;
  transfer_recipient: object | null;
  transfer_subject: object | null;
}

export type NotificationDetails =
  | DiscussionNotificationDetails
  | MembershipRequestNotificationDetails
  | TransferRequestNotificationDetails;

export interface Notification {
  id: string;
  created_at: string;
  last_modified: string;
  handled_at: string | null;
  user: UserRef | null;
  details: NotificationDetails;
}

export interface ReportReason {
  value: string;
  label: string;
}

export interface ReportCreatePayload {
  subject: { class: string; id: string };
  reason: string;
  message?: string;
}

export interface Report {
  id: string;
  by: UserRef | null;
  subject: { class: string; id: string };
  reason: string;
  message: string | null;
  reported_at: string;
  dismissed_at: string | null;
  dismissed_by: UserRef | null;
  subject_deleted_at: string | null;
  self_api_url: string;
}

export type FollowableEntityType = "datasets" | "organizations" | "reuses";

export interface Follow {
  id: string;
  follower: UserRef;
  since: string;
}

export interface FollowResponse {
  followers: number;
}

export interface CommunityResource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  filetype: string | null;
  format: string | null;
  dataset: DatasetRef | null;
  organization: Organization | null;
  owner: UserRef | null;
  created_at: string;
  last_modified: string;
}

export interface CommunityResourceCreatePayload {
  title: string;
  description?: string;
  url: string;
  filetype?: "file" | "remote";
  type?: string;
  format?: string;
  dataset: string;
  organization?: string;
  schema?: { name?: string; url?: string };
}

export interface CommunityResourceUpdatePayload {
  title?: string;
  description?: string;
  url?: string;
  filetype?: string;
  type?: string;
  format?: string;
  dataset?: string;
  organization?: string;
  schema?: { name?: string; url?: string };
}

export interface HarvestJob {
  id: string;
  status: "pending" | "started" | "done" | "failed";
  started: string | null;
  ended: string | null;
  errors: number;
  items: number;
}

export interface HarvestSource {
  id: string;
  name: string;
  description: string | null;
  url: string;
  backend: string;
  organization: Organization | null;
  schedule: string | null;
  config: Record<string, unknown>;
  filters: Record<string, unknown>[];
  features: Record<string, boolean>;
  active: boolean;
  autoarchive: boolean;
  created_at: string;
  last_modified: string;
  last_job: HarvestJob | null;
}

export interface HarvestSourceCreatePayload {
  name: string;
  description?: string;
  url: string;
  backend: string;
  organization?: string;
  schedule?: string;
  config?: Record<string, unknown>;
  filters?: Record<string, unknown>[];
  features?: Record<string, boolean>;
  active?: boolean;
  autoarchive?: boolean;
}

export interface HarvestSourceUpdatePayload {
  name?: string;
  description?: string;
  url?: string;
  backend?: string;
  organization?: string;
  schedule?: string;
  config?: Record<string, unknown>;
  filters?: Record<string, unknown>[];
  features?: Record<string, boolean>;
  active?: boolean;
  autoarchive?: boolean;
}

export type UserRole = string;

export interface UserAdmin extends UserPublic {
  datasets_count: number;
  reuses_count: number;
  last_login: string | null;
}

export interface UserAdminUpdatePayload {
  first_name?: string;
  last_name?: string;
  roles?: UserRole[];
  active?: boolean;
}

export interface UserSuggestion {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  avatar_thumbnail: string | null;
  score: number;
}

export interface HomeContent {
  featured_datasets: Dataset[];
  featured_reuses: Reuse[];
}

export interface APIResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  next_page: string | null;
  previous_page: string | null;
}
