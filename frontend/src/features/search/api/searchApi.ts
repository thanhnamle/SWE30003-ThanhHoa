import apiClient from "@/lib/apiClient";

export interface SearchResultDto {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    url: string;
}

export const searchApi = {
    globalSearch: async (query: string): Promise<SearchResultDto[]> => {
        const response = await apiClient.get(`/api/Search?q=${encodeURIComponent(query)}`);
        return response.data;
    }
};
