import apiClient from '../../../lib/apiClient';
import { Shipment } from '../../shipments/api/shipmentApi';

export interface ProofOfDeliveryRequest {
  shipmentId: string;
  signatureImageBase64: string;
  notes?: string;
}

export const trackingApi = {
  // Get shipments assigned to the logged-in driver (ReadyForPickup | InTransit | Delivered)
  getDriverShipments: async (): Promise<Shipment[]> => {
    const response = await apiClient.get<Shipment[]>('/api/tracking/shipments');
    return response.data;
  },

  submitProofOfDelivery: async (
    request: ProofOfDeliveryRequest
  ): Promise<{ success: boolean; deliveredAt: string }> => {
    const response = await apiClient.post<{ success: boolean; deliveredAt: string }>(
      `/api/tracking/${request.shipmentId}/pod`,
      request
    );
    return response.data;
  },

  updateShipmentStatus: async (shipmentId: string, newStatus: string): Promise<void> => {
    await apiClient.post(`/api/tracking/${shipmentId}/status`, { status: newStatus });
  },
};
