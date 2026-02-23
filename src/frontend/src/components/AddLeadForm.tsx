import { useState } from 'react';
import { useAddLead } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddLeadFormProps {
  onSuccess: () => void;
}

export default function AddLeadForm({ onSuccess }: AddLeadFormProps) {
  const [customerName, setCustomerName] = useState('');
  const addLead = useAddLead();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    try {
      await addLead.mutateAsync(customerName);
      toast.success('Lead added successfully!');
      setCustomerName('');
      onSuccess();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Add New Lead</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
          required
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={addLead.isPending}>
          {addLead.isPending ? 'Adding...' : 'Add Lead'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

