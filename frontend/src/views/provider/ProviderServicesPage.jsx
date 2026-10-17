/**
 * ProviderServicesPage View
 * Comprehensive service catalogue management:
 * - View existing services
 * - Add service modal with validation
 * - Edit service modal with prefilled data
 * - Delete service with confirmation
 * - Immediate store update
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Scissors, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Modal } from '../components/Modal.jsx';
import { Input, Textarea, Select } from '../components/Input.jsx';
import { providerController } from '../../controllers/providerController.js';
import {
  selectProviderBusiness,
  selectProviderServices,
} from '../../features/provider/providerSlice.js';

export const ProviderServicesPage = () => {
  const business = useSelector(selectProviderBusiness);
  const services = useSelector(selectProviderServices);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState(business?.category || 'Hair Salons & Styling');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(75);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isPopular, setIsPopular] = useState(false);

  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingServiceId(null);
    setName('');
    setCategory(business?.category || 'Hair Salons & Styling');
    setDescription('');
    setPrice(75);
    setDurationMinutes(60);
    setIsPopular(false);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingServiceId(service.id);
    setName(service.name);
    setCategory(service.category || business?.category);
    setDescription(service.description || '');
    setPrice(service.price);
    setDurationMinutes(service.durationMinutes);
    setIsPopular(!!service.isPopular);
    setError('');
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!business?.id) return;

    const payload = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      isPopular,
    };

    let res;
    if (editingServiceId) {
      res = providerController.updateService(editingServiceId, payload);
    } else {
      res = providerController.createService(business.id, payload);
    }

    if (res.success) {
      setModalOpen(false);
      setError('');
    } else {
      setError(res.error || 'Failed to save service');
    }
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to remove this service from your catalogue?')) {
      providerController.deleteService(serviceId);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-canvas border border-hairline p-6 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-ink leading-tight1 mb-1">
            Services Catalogue ({services.length})
          </h2>
          <p className="text-[13.5px] text-mute">
            Configure the offerings, durations, and pricing displayed to clients.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Service</span>
        </Button>
      </div>

      {/* Services List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-canvas border border-hairline hover:border-hairline-strong p-5 rounded-none flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                  {srv.category}
                </span>
                <span className="text-[18px] font-bold text-ink">
                  ₹{srv.price}
                </span>
              </div>

              <h4 className="text-[17px] font-bold text-ink leading-tight1 mb-2">
                {srv.name}
              </h4>
              <p className="text-[13.5px] text-mute line-clamp-3 mb-4 leading-relaxed">
                {srv.description}
              </p>

              <div className="flex items-center gap-3 text-[12.5px] text-charcoal mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-mute" />
                  <span>{srv.durationMinutes} mins</span>
                </div>
                {srv.isPopular && (
                  <span className="px-2 py-0.5 bg-primary/20 text-ink font-bold text-[10px] uppercase">
                    Popular
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => openEditModal(srv)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteService(srv.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingServiceId ? 'Edit Service Offering' : 'Add New Service Offering'}
        subtitle="Specify service title, description, time duration, and pricing"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-error/15 border-l-4 border-error text-error text-[13px] font-semibold">
              {error}
            </div>
          )}

          <Input
            label="Service Title"
            required
            placeholder="e.g. Master Balayage & Botanical Scalp Rinse"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Hair Salons & Styling', label: 'Hair Salons & Styling' },
              { value: 'Spas & Wellness', label: 'Spas & Wellness' },
              { value: 'Fitness & Studios', label: 'Fitness & Studios' },
              { value: 'Barbers & Grooming', label: 'Barbers & Grooming' },
              { value: 'Nails & Beauty Care', label: 'Nails & Beauty Care' },
              { value: 'Yoga & Mindfulness', label: 'Yoga & Mindfulness' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹ INR)"
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Input
              label="Duration (Minutes)"
              type="number"
              required
              step={15}
              min={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>

          <Textarea
            label="Service Description"
            rows={3}
            placeholder="Describe the steps, techniques, and client benefits..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPopular"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-4 h-4 text-ink rounded-none cursor-pointer"
            />
            <label htmlFor="isPopular" className="text-[13.5px] font-medium text-charcoal cursor-pointer">
              Mark as popular recommendation
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline-dark"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingServiceId ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderServicesPage;
