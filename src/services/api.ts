import {
  Activity,
  APIResponse,
  Dataservice,
  Dataset,
  DatasetBadges,
  DatasetCreatePayload,
  DatasetFilters,
  DatasetSuggestion,
  DatasetUpdatePayload,
  Discussion,
  FormatSuggestion,
  Frequency,
  GlobalSearchSuggestion,
  License,
  MembershipRequest,
  Notification,
  OrgBadges,
  OrgRole,
  Organization,
  OrganizationFilters,
  OrganizationMember,
  OrganizationSuggestion,
  Post,
  Resource,
  ResourceCreatePayload,
  ResourceType,
  ResourceUpdatePayload,
  Reuse,
  ReuseFilters,
  ReuseSuggestion,
  ReuseType,
  SiteInfo,
  GeoLevel,
  Granularity,
  Report,
  ReportCreatePayload,
  ReportReason,
  SpatialZone,
  TagSuggestion,
  Topic,
  TopicElement,
  UserPublic,
  UserRef,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://dados.gov.pt/api/1";
const API_V2_BASE_URL = process.env.NEXT_PUBLIC_API_V2_BASE || "https://dados.gov.pt/api/2";

/**
 * Fetch CSRF token from backend
 */
export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/csrf", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch CSRF token");
  const data = await res.json();
  return data.csrf_token;
}

/**
 * Perform login using the frontend route handler proxy
 */
export async function login(formData: FormData): Promise<{ message: string; redirect?: string }> {
  const res = await fetch("/login", {
    method: "POST",
    body: new URLSearchParams(formData as any),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
}

/**
 * Perform logout
 */
export async function logout(): Promise<void> {
  const res = await fetch("/logout/", { method: "GET" });
  if (!res.ok) throw new Error("Logout failed");
}

/**
 * Fetch the currently authenticated user profile
 */
export async function fetchCurrentUser(): Promise<UserRef | null> {
  try {
    const res = await fetch("/me", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch the authenticated user's personal datasets (owner = current user).
 * Backend returns a flat array; we filter out org-owned and wrap into APIResponse.
 */
export async function fetchMyDatasets(
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/me/datasets/`,
      { cache: "no-store", credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch my datasets: ${res.statusText}`);
    }

    const raw: Dataset[] = await res.json();
    // Keep only personal datasets: owner must exist and organization must be absent
    const allDatasets = raw.filter((d) => !!d.owner && !d.organization);
    const total = allDatasets.length;
    const start = (page - 1) * pageSize;
    const data = allDatasets.slice(start, start + pageSize);

    return {
      data,
      page,
      page_size: pageSize,
      total,
      next_page: start + pageSize < total ? String(page + 1) : null,
      previous_page: page > 1 ? String(page - 1) : null,
    };
  } catch (error) {
    console.error("Error fetching my datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

/**
 * Fetch the authenticated user's reuses (paginated)
 */
export async function fetchMyReuses(
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Reuse>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/me/reuses/?page=${page}&page_size=${pageSize}`,
      { cache: "no-store", credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch my reuses: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching my reuses:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

/**
 * Fetch datasets from the authenticated user's organizations.
 * Backend returns a flat array; we wrap it into APIResponse for consistency.
 */
export async function fetchMyOrgDatasets(
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/me/org_datasets/`,
      { cache: "no-store", credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch my org datasets: ${res.statusText}`);
    }

    const allDatasets: Dataset[] = await res.json();
    const total = allDatasets.length;
    const start = (page - 1) * pageSize;
    const data = allDatasets.slice(start, start + pageSize);

    return {
      data,
      page,
      page_size: pageSize,
      total,
      next_page: start + pageSize < total ? String(page + 1) : null,
      previous_page: page > 1 ? String(page - 1) : null,
    };
  } catch (error) {
    console.error("Error fetching my org datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

/**
 * Fetch the public profile of any user by ID or slug
 */
export async function fetchUserProfile(userId: string): Promise<UserPublic | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch user profile: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function fetchDatasets(
  page: number = 1,
  pageSize: number = 20,
  filters?: DatasetFilters
): Promise<APIResponse<Dataset>> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    if (filters) {
      if (filters.q) params.set("q", filters.q);
      if (filters.schema) params.set("schema", filters.schema);
      if (filters.geozone) params.set("geozone", filters.geozone);
      if (filters.granularity) params.set("granularity", filters.granularity);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.featured !== undefined) params.set("featured", String(filters.featured));

      const arrayParams: [string, string | string[] | undefined][] = [
        ["tag", filters.tag],
        ["license", filters.license],
        ["format", filters.format],
        ["badge", filters.badge],
        ["organization", filters.organization],
      ];
      for (const [key, value] of arrayParams) {
        if (!value) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    }

    const url = `${API_BASE_URL}/datasets/?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch datasets: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchDataset(slug: string): Promise<Dataset> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/${slug}/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch dataset: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching dataset:", error);
    throw error;
  }
}

export async function fetchOrganizations(
  page: number = 1,
  pageSize: number = 20,
  filters?: OrganizationFilters
): Promise<APIResponse<Organization>> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    if (filters) {
      if (filters.q) params.set("q", filters.q);
      if (filters.badge) params.set("badge", filters.badge);
      if (filters.sort) params.set("sort", filters.sort);
    }

    const url = `${API_BASE_URL}/organizations/?${params.toString()}`;
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch organizations: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}
export async function suggestOrganizations(
  query: string,
  size: number = 5
): Promise<OrganizationSuggestion[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/organizations/suggest/?q=${encodeURIComponent(query)}&size=${size}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to suggest organizations: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error suggesting organizations:", error);
    return [];
  }
}

export async function fetchOrgBadges(): Promise<OrgBadges> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizations/badges/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch org badges: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching org badges:", error);
    return {};
  }
}

export async function fetchOrganization(slugOrId: string): Promise<Organization | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizations/${slugOrId}/`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch organization: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

export async function fetchOrgDatasets(
  org: string,
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/organizations/${org}/datasets/?page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch organization datasets: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching organization datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchOrgReuses(org: string): Promise<Reuse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizations/${org}/reuses/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch organization reuses: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching organization reuses:", error);
    return [];
  }
}

export async function fetchOrgDiscussions(org: string): Promise<Discussion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizations/${org}/discussions/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch organization discussions: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching organization discussions:", error);
    return [];
  }
}

export async function fetchOrgDataservices(
  org: string,
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Dataservice>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/dataservices/?organization=${org}&page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch organization dataservices: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching organization dataservices:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchReuses(
  page: number = 1,
  pageSize: number = 20,
  filters?: ReuseFilters
): Promise<APIResponse<Reuse>> {
  const empty: APIResponse<Reuse> = {
    data: [],
    page: 1,
    page_size: pageSize,
    total: 0,
    next_page: null,
    previous_page: null,
  };

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    if (filters) {
      if (filters.q) params.set("q", filters.q);
      if (filters.type) params.set("type", filters.type);
      if (filters.tag) params.set("tag", filters.tag);
      if (filters.organization) params.set("organization", filters.organization);
      if (filters.sort) params.set("sort", filters.sort);
    }

    const url = `${API_BASE_URL}/reuses/?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return empty;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching reuses:", error);
    return empty;
  }
}
export async function fetchReuse(rid: string): Promise<Reuse> {
  try {
    const res = await fetch(`${API_BASE_URL}/reuses/${rid}/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reuse: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching reuse:", error);
    throw error;
  }
}

export async function fetchReuseTypes(): Promise<ReuseType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reuses/types/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch reuse types: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching reuse types:", error);
    return [];
  }
}

export async function suggestReuses(
  query: string,
  size: number = 5
): Promise<ReuseSuggestion[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/reuses/suggest/?q=${encodeURIComponent(query)}&size=${size}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Failed to suggest reuses: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error suggesting reuses:", error);
    return [];
  }
}

export async function followReuse(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/reuses/${id}/followers/`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to follow reuse: ${res.statusText}`);
}

export async function unfollowReuse(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/reuses/${id}/followers/`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to unfollow reuse: ${res.statusText}`);
}

export async function fetchSiteInfo(): Promise<SiteInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/site/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch site info: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching site info:", error);
    return {
      id: "",
      title: "",
      metrics: { datasets: 0, organizations: 0, reuses: 0, users: 0 },
    };
  }
}

export async function fetchFeaturedDatasets(pageSize: number = 3): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/?featured=true&page_size=${pageSize}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch featured datasets: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching featured datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchFeaturedReuses(pageSize: number = 3): Promise<APIResponse<Reuse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/reuses/?featured=true&page_size=${pageSize}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch featured reuses: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching featured reuses:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchLatestDatasets(pageSize: number = 3): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/?sort=-created&page_size=${pageSize}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch latest datasets: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching latest datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchLatestReuses(pageSize: number = 3): Promise<APIResponse<Reuse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/reuses/?sort=-created&page_size=${pageSize}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch latest reuses: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching latest reuses:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchPosts(
  page: number = 1,
  pageSize: number = 3
): Promise<APIResponse<Post>> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/?page=${page}&page_size=${pageSize}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchPost(slugOrId: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${slugOrId}/`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function searchDatasets(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/datasets/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to search datasets: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error searching datasets:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function searchOrganizations(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<APIResponse<Organization>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/organizations/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to search organizations: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error searching organizations:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function searchReuses(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<APIResponse<Reuse>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/reuses/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to search reuses: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error searching reuses:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchLicenses(): Promise<License[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/licenses/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch licenses: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching licenses:", error);
    return [];
  }
}

export async function fetchFrequencies(): Promise<Frequency[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/frequencies/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch frequencies: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching frequencies:", error);
    return [];
  }
}

export async function fetchSchemas(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/schemas/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch schemas: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching schemas:", error);
    return [];
  }
}

export async function fetchDatasetBadges(): Promise<DatasetBadges> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/badges/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch dataset badges: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching dataset badges:", error);
    return {};
  }
}

export async function fetchResourceTypes(): Promise<ResourceType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets/resource_types/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch resource types: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching resource types:", error);
    return [];
  }
}

// --- Dataset CRUD ---

export async function createDataset(payload: DatasetCreatePayload): Promise<Dataset> {
  const res = await fetch(`${API_BASE_URL}/datasets/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, data: error };
  }
  return await res.json();
}

export async function updateDataset(id: string, payload: DatasetUpdatePayload): Promise<Dataset> {
  const res = await fetch(`${API_BASE_URL}/datasets/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, data: error };
  }
  return await res.json();
}

export async function deleteDataset(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/datasets/${id}/`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to delete dataset: ${res.statusText}`);
}

// --- Resource CRUD ---

export async function createResource(
  datasetId: string,
  payload: ResourceCreatePayload
): Promise<Resource> {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/resources/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, data: error };
  }
  return await res.json();
}

export async function uploadResource(datasetId: string, file: File): Promise<Resource> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/upload/`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, data: error };
  }
  return await res.json();
}

export async function updateResource(
  datasetId: string,
  resourceId: string,
  payload: ResourceUpdatePayload
): Promise<Resource> {
  const res = await fetch(
    `${API_BASE_URL}/datasets/${datasetId}/resources/${resourceId}/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, data: error };
  }
  return await res.json();
}

export async function deleteResource(datasetId: string, resourceId: string): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/datasets/${datasetId}/resources/${resourceId}/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error(`Failed to delete resource: ${res.statusText}`);
}

export async function reorderResources(datasetId: string, resourceIds: string[]): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/resources/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(resourceIds),
  });
  if (!res.ok) throw new Error(`Failed to reorder resources: ${res.statusText}`);
}

// --- Dataset Featured Toggle ---

export async function toggleDatasetFeatured(id: string, featured: boolean): Promise<Dataset> {
  const res = await fetch(`${API_BASE_URL}/datasets/${id}/featured/`, {
    method: featured ? "POST" : "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to toggle dataset featured: ${res.statusText}`);
  return await res.json();
}

// --- Activity ---

export async function fetchActivity(
  relatedTo: string,
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Activity>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/activity/?related_to=${relatedTo}&sort=-created_at&page=${page}&page_size=${pageSize}`,
      { cache: "no-store", credentials: "include" }
    );
    if (!res.ok) throw new Error(`Failed to fetch activity: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching activity:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function suggestFormats(query: string): Promise<FormatSuggestion[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/datasets/suggest/formats/?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Failed to suggest formats: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error suggesting formats:", error);
    return [];
  }
}

export async function suggestTags(query: string, size: number = 10): Promise<TagSuggestion[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/tags/suggest/?q=${encodeURIComponent(query)}&size=${size}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Failed to suggest tags: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return [];
  }
}

export async function suggestDatasets(
  query: string,
  size: number = 5
): Promise<DatasetSuggestion[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/datasets/suggest/?q=${encodeURIComponent(query)}&size=${size}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch dataset suggestions: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching dataset suggestions:", error);
    return [];
  }
}

// --- Account Migration ---

export async function fetchMigrationPending(): Promise<{
  pending: boolean;
  email?: string;
  has_email?: boolean;
  first_name?: string;
  last_name?: string;
}> {
  const res = await fetch("/saml/migration/pending", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch migration status");
  return await res.json();
}

export async function searchMigrationAccount(
  payload: { email?: string; first_name?: string; last_name?: string }
): Promise<{ found: boolean; email?: string }> {
  const res = await fetch("/saml/migration/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to search migration account");
  return await res.json();
}

export async function sendMigrationCode(): Promise<{ sent: boolean }> {
  const res = await fetch("/saml/migration/send-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to send migration code");
  }
  return await res.json();
}

export async function confirmMigration(
  payload: { method: "code"; code: string } | { method: "password"; password: string }
): Promise<{ success: boolean }> {
  const res = await fetch("/saml/migration/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to confirm migration");
  }
  return await res.json();
}

export async function skipMigration(): Promise<{ success: boolean }> {
  const res = await fetch("/saml/migration/skip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to skip migration");
  return await res.json();
}

export async function suggestGlobalSearch(
  query: string,
  size: number = 5
): Promise<GlobalSearchSuggestion[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/datasets/suggest/?q=${encodeURIComponent(query)}&size=${size}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch search suggestions: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
}

// --- Notifications ---

export async function fetchNotifications(
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Notification>> {
  const res = await fetch(
    `${API_BASE_URL}/notifications/?page=${page}&page_size=${pageSize}`,
    { cache: "no-store", credentials: "include" }
  );

  if (res.status === 401) {
    throw new Error("Authentication required");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.statusText}`);
  }

  return await res.json();
}

// --- Topics (API v2) ---

export async function fetchTopics(
  page: number = 1,
  pageSize: number = 20
): Promise<APIResponse<Topic>> {
  try {
    const res = await fetch(
      `${API_V2_BASE_URL}/topics/?page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch topics: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching topics:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

export async function fetchTopic(slugOrId: string): Promise<Topic | null> {
  try {
    const res = await fetch(`${API_V2_BASE_URL}/topics/${slugOrId}/`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch topic: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching topic:", error);
    throw error;
  }
}

export async function fetchTopicElements(
  topicId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<APIResponse<TopicElement>> {
  try {
    const res = await fetch(
      `${API_V2_BASE_URL}/topics/${topicId}/elements/?page=${page}&page_size=${pageSize}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch topic elements: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching topic elements:", error);
    return {
      data: [],
      page: 1,
      page_size: pageSize,
      total: 0,
      next_page: null,
      previous_page: null,
    };
  }
}

// --- Spatial / Geographic ---

export async function suggestSpatialZones(
  query: string,
  size: number = 10
): Promise<SpatialZone[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/spatial/zones/suggest/?q=${encodeURIComponent(query)}&size=${size}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Failed to suggest spatial zones: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error suggesting spatial zones:", error);
    return [];
  }
}

export async function fetchSpatialZones(ids: string[]): Promise<object> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/spatial/zones/${ids.join(",")}/`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Failed to fetch spatial zones: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching spatial zones:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

export async function fetchGranularities(): Promise<Granularity[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/spatial/granularities/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch granularities: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching granularities:", error);
    return [];
  }
}

export async function fetchGeoLevels(): Promise<GeoLevel[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/spatial/levels/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch geo levels: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching geo levels:", error);
    return [];
  }
}

// --- Reports ---

export async function fetchReportReasons(): Promise<ReportReason[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/reasons/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch report reasons: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching report reasons:", error);
    return [];
  }
}

export async function createReport(payload: ReportCreatePayload): Promise<Report> {
  const res = await fetch(`${API_BASE_URL}/reports/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to create report: ${res.statusText}`);
  }

  return await res.json();

// --- Organization Membership ---

export async function requestMembership(org: string, comment?: string): Promise<MembershipRequest> {
  const res = await fetch(`${API_BASE_URL}/organizations/${org}/membership/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comment: comment || "" }),
  });
  if (!res.ok) throw new Error(`Failed to request membership: ${res.statusText}`);
  return await res.json();
}

export async function fetchMembershipRequests(org: string): Promise<MembershipRequest[]> {
  const res = await fetch(`${API_BASE_URL}/organizations/${org}/membership/`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch membership requests: ${res.statusText}`);
  return await res.json();
}

export async function acceptMembership(org: string, requestId: string): Promise<MembershipRequest> {
  const res = await fetch(
    `${API_BASE_URL}/organizations/${org}/membership/${requestId}/accept/`,
    { method: "POST", credentials: "include" }
  );
  if (!res.ok) throw new Error(`Failed to accept membership: ${res.statusText}`);
  return await res.json();
}

export async function refuseMembership(
  org: string,
  requestId: string,
  comment?: string
): Promise<MembershipRequest> {
  const res = await fetch(
    `${API_BASE_URL}/organizations/${org}/membership/${requestId}/refuse/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ comment: comment || "" }),
    }
  );
  if (!res.ok) throw new Error(`Failed to refuse membership: ${res.statusText}`);
  return await res.json();
}

export async function addMember(
  org: string,
  userId: string,
  role: string
): Promise<OrganizationMember> {
  const res = await fetch(`${API_BASE_URL}/organizations/${org}/member/${userId}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error(`Failed to add member: ${res.statusText}`);
  return await res.json();
}

export async function updateMemberRole(
  org: string,
  userId: string,
  role: string
): Promise<OrganizationMember> {
  const res = await fetch(`${API_BASE_URL}/organizations/${org}/member/${userId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error(`Failed to update member role: ${res.statusText}`);
  return await res.json();
}

export async function removeMember(org: string, userId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/organizations/${org}/member/${userId}/`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to remove member: ${res.statusText}`);
}

export async function fetchOrgRoles(): Promise<OrgRole[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizations/roles/`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch org roles: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching org roles:", error);
    return [];
  }
}

// --- CSV Export URL Builders ---

type OrgExportType = "datasets" | "dataservices" | "discussions" | "datasets-resources";
type SiteExportType =
  | "datasets"
  | "resources"
  | "organizations"
  | "reuses"
  | "dataservices"
  | "harvests"
  | "tags";

export function getOrgExportUrl(org: string, type: OrgExportType): string {
  return `${API_BASE_URL}/organizations/${org}/${type}.csv`;
}

export function getSiteExportUrl(type: SiteExportType): string {
  return `${API_BASE_URL}/site/${type}.csv`;
}
