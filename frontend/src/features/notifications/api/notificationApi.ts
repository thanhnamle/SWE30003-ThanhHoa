import apiClient from "@/lib/apiClient";

export interface NotificationDto {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: string;
}

export const notificationApi = {
    getRecent: async (limit: number = 10): Promise<NotificationDto[]> => {
        const response = await apiClient.get(`/api/Notifications?limit=${limit}`);
        return response.data;
    },

    markAllAsRead: async (): Promise<void> => {
        await apiClient.put(`/api/Notifications/read-all`);
    },

    markAsRead: async (id: string): Promise<void> => {
        await apiClient.put(`/api/Notifications/${id}/read`);
    }
};
