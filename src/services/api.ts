import {
  APIResponse,
  Dataservice,
  Dataset,
  DatasetBadges,
  DatasetFilters,
  DatasetSuggestion,
  Discussion,
  FormatSuggestion,
  Frequency,
  GlobalSearchSuggestion,
  License,
  OrgBadges,
  Organization,
  OrganizationFilters,
  OrganizationSuggestion,
  Post,
  Reuse,
  ReuseFilters,
  ReuseSuggestion,
  ReuseType,
  SiteInfo,
  TagSuggestion,
  User,
  UserRef,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://dados.gov.pt/api/1";

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
 * Perform registration using the frontend route handler proxy
 */
export async function register(
  formData: FormData
): Promise<{
  status: string;
  error?: string;
  redirect?: string;
  requireEmailConfirmation?: boolean;
}> {
  const res = await fetch("/register", {
    method: "POST",
    body: new URLSearchParams(formData as any),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
}

/**
 * Perform logout
 */
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
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch("/me", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
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
