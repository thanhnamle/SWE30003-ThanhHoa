import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackingApi } from '../../tracking/api/trackingApi';
import { AlertTriangle, Clock, Play, CheckCircle2, X, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface ExceptionModalProps {
  shipmentId: string;
  onClose: () => void;
}

export function ExceptionModal({ shipmentId, onClose }: ExceptionModalProps) {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newType, setNewType] = useState('VehicleBreakdown');
  const [newDesc, setNewDesc] = useState('');

  const { data: exceptions = [], isLoading } = useQuery({
    queryKey: ['exceptions', shipmentId],
    queryFn: () => trackingApi.getExceptions(shipmentId),
  });

  const logMutation = useMutation({
    mutationFn: (data: { type: string; description: string }) => trackingApi.logException(shipmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions', shipmentId] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowCreate(false);
      setNewDesc('');
    }
  });

  const resolveMutation = useMutation({
    mutationFn: trackingApi.resolveException,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions', shipmentId] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const holdMutation = useMutation({
    mutationFn: trackingApi.holdException,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exceptions', shipmentId] })
  });

  const resumeMutation = useMutation({
    mutationFn: trackingApi.resumeException,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exceptions', shipmentId] })
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDesc.trim()) {
      logMutation.mutate({ type: newType, description: newDesc });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Open</span>;
      case 'OnHold':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1"><Clock className="w-3 h-3"/> On Hold</span>;
      case 'Resolved':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Resolved</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">{status}</span>;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Exception Management</h2>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Shipment Ref: {shipmentId.split('-')[0]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 text-gray-500 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700">Reported Exceptions</h3>
            {!showCreate && (
              <button 
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition"
              >
                <Plus className="w-4 h-4" /> New Exception
              </button>
            )}
          </div>

          {showCreate && (
            <form onSubmit={handleCreate} className="mb-6 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Log New Exception</h4>
              <div className="space-y-3">
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none"
                >
                  <option value="VehicleBreakdown">Vehicle Breakdown</option>
                  <option value="WrongAddress">Wrong Address</option>
                  <option value="CargoDelay">Cargo Delay</option>
                  <option value="FailedDeliveryAttempt">Failed Delivery Attempt</option>
                  <option value="Other">Other</option>
                </select>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none resize-none h-24"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={logMutation.isPending} className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700">Submit</button>
                </div>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-gray-400">Loading exceptions...</div>
          ) : exceptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No exceptions reported for this shipment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exceptions.map((exc) => (
                <div key={exc.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{exc.type}</span>
                        {getStatusBadge(exc.status)}
                      </div>
                      <p className="text-xs text-gray-400 font-medium">Reported: {format(new Date(exc.raisedAt), 'PP p')}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {exc.status === 'Open' && (
                        <>
                          <button 
                            onClick={() => holdMutation.mutate(exc.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition"
                          >
                            <Clock className="w-3.5 h-3.5" /> Hold
                          </button>
                          <button 
                            onClick={() => resolveMutation.mutate(exc.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                          </button>
                        </>
                      )}
                      {exc.status === 'OnHold' && (
                        <>
                          <button 
                            onClick={() => resumeMutation.mutate(exc.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                          >
                            <Play className="w-3.5 h-3.5" /> Resume
                          </button>
                          <button 
                            onClick={() => resolveMutation.mutate(exc.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-700">{exc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
