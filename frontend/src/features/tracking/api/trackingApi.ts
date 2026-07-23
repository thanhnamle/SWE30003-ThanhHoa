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
    _request: ProofOfDeliveryRequest
  ): Promise<{ success: boolean; deliveredAt: string }> => {
    // Proof of Delivery endpoint not yet implemented on backend – returns optimistic response
    return Promise.resolve({
      success: true,
      deliveredAt: new Date().toISOString(),
    });
  },

  updateShipmentStatus: async (shipmentId: string, newStatus: string): Promise<void> => {
    await apiClient.post(`/api/tracking/${shipmentId}/status`, { status: newStatus });
  },
};
