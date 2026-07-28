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
    // Calling backend to update status to Delivered instead of fake optimistic response
    await apiClient.put(`/api/shipments/${request.shipmentId}/status`, { status: 'Delivered' });
    return {
      success: true,
      deliveredAt: new Date().toISOString(),
    };
  },

  updateShipmentStatus: async (shipmentId: string, newStatus: string): Promise<void> => {
    await apiClient.put(`/api/shipments/${shipmentId}/status`, { status: newStatus });
  },

  getExceptions: async (shipmentId: string): Promise<DeliveryExceptionDto[]> => {
    const response = await apiClient.get<DeliveryExceptionDto[]>(`/api/tracking/${shipmentId}/exceptions`);
    return response.data;
  },

  logException: async (shipmentId: string, request: LogExceptionDto): Promise<void> => {
    await apiClient.post(`/api/tracking/${shipmentId}/exceptions`, request);
  },

  resolveException: async (exceptionId: string): Promise<void> => {
    await apiClient.put(`/api/tracking/exceptions/${exceptionId}/resolve`);
  },

  holdException: async (exceptionId: string): Promise<void> => {
    await apiClient.put(`/api/tracking/exceptions/${exceptionId}/hold`);
  },

  resumeException: async (exceptionId: string): Promise<void> => {
    await apiClient.put(`/api/tracking/exceptions/${exceptionId}/resume`);
  },
};

export interface DeliveryExceptionDto {
  id: string;
  type: string;
  status: string; // 'Open', 'OnHold', 'Resolved'
  description: string;
  resolutionAction?: string;
  raisedAt: string;
  resolvedAt?: string;
  shipmentId: string;
}

export interface LogExceptionDto {
  type: string;
  description: string;
}
