import { APIResponse, Dataset } from '@/types/api';

const API_BASE_URL = 'http://dev.local:7000/api/1';

export async function fetchDatasets(
  page: number = 1,
  pageSize: number = 20,
): Promise<APIResponse<Dataset>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/datasets/?page=${page}&page_size=${pageSize}`,
      {
        cache: 'no-store', // Ensure fresh data
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch datasets: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching datasets:', error);
    // Return empty state or rethrow depending on desired error handling
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
