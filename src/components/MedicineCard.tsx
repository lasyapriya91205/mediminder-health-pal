
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, MoreVertical, Edit, Trash, PillBottle } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MedicineCardProps {
  medicine: {
    id: string;
    name: string;
    description: string | null;
    dosage: string;
    time: string;
    imageUrl: string;
  };
  isActive: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onTakeMedicine?: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ 
  medicine, 
  isActive, 
  onEdit, 
  onDelete,
  onTakeMedicine 
}) => {
  const [taken, setTaken] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [medicineImage, setMedicineImage] = useState<string>("/placeholder.svg");
  
  useEffect(() => {
    const fetchMedicineImage = async () => {
      if (!medicine.name || imageError) return;
      
      setImageLoading(true);
      try {
        // Normalize medicine name to lowercase for comparisons
        const medicineName = medicine.name.toLowerCase().trim();
        
        // Common medicine specific images - using more direct pill images
        const commonMedicines: Record<string, string> = {
          'aspirin': 'https://images.unsplash.com/photo-1626379530580-6a58c5cf1d77?w=600&auto=format&fit=crop',
          'tylenol': 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop',
          'advil': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
          'ibuprofen': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
          'acetaminophen': 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop',
          'paracetamol': 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop',
          'lisinopril': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop',
          'metformin': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop',
          'atorvastatin': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
          'levothyroxine': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop',
          'albuterol': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop',
          'omeprazole': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop',
          'amlodipine': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
          'metoprolol': 'https://images.unsplash.com/photo-1616261167032-b16d2df8333b?w=600&auto=format&fit=crop',
          'simvastatin': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
          'losartan': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop',
          'gabapentin': 'https://images.unsplash.com/photo-1616261167032-b16d2df8333b?w=600&auto=format&fit=crop',
          'hydrochlorothiazide': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop',
          'sertraline': 'https://images.unsplash.com/photo-1616261167032-b16d2df8333b?w=600&auto=format&fit=crop',
          'montelukast': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop',
          'tonic': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop',
          'vitamin': 'https://images.unsplash.com/photo-1577515064471-8670af29b524?w=600&auto=format&fit=crop',
          'supplement': 'https://images.unsplash.com/photo-1577515064471-8670af29b524?w=600&auto=format&fit=crop',
          'pill': 'https://images.unsplash.com/photo-1626379530580-6a58c5cf1d77?w=600&auto=format&fit=crop',
          'capsule': 'https://images.unsplash.com/photo-1577515064471-8670af29b524?w=600&auto=format&fit=crop',
          'tablet': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
          'syrup': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&auto=format&fit=crop',
          'medicine': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop'
        };
        
        // Check if this is a common medicine we know about - check for partial matches too
        for (const [key, imageUrl] of Object.entries(commonMedicines)) {
          if (medicineName.includes(key)) {
            setMedicineImage(imageUrl);
            setImageLoading(false);
            return;
          }
        }
        
        // Fallback to a general pill image
        setMedicineImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop');
        setImageLoading(false);
      } catch (error) {
        console.error("Error fetching medicine image:", error);
        setImageError(true);
        setMedicineImage("/placeholder.svg");
        setImageLoading(false);
      }
    };
    
    fetchMedicineImage();
  }, [medicine.name, imageError]);
  
  const handleTakeMedicine = () => {
    setTaken(true);
    if (onTakeMedicine) {
      onTakeMedicine();
    }
  };
  
  const getStatusIcon = () => {
    if (taken) {
      return <CheckCircle className="text-green-500" />;
    }
    if (isActive) {
      return <Clock className="text-teal-500 animate-pulse" />;
    }
    const [hours, minutes] = medicine.time.split(':').map(Number);
    const medicineTime = new Date();
    medicineTime.setHours(hours, minutes, 0);
    
    if (medicineTime < new Date()) {
      return <AlertCircle className="text-amber-500" />;
    }
    
    return <Clock className="text-slate-400" />;
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg border ${taken ? 'border-green-100 bg-green-50/30' : isActive ? 'border-teal-100 bg-teal-50' : 'border-slate-100'} ${taken ? 'opacity-70' : ''}`}>
      <div className="md:w-1/4 flex-shrink-0 relative">
        {imageLoading ? (
          <div className="w-full h-24 flex items-center justify-center bg-slate-100 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <img
            src={medicineImage}
            alt={medicine.name}
            className="w-full h-24 object-cover rounded-lg bg-slate-100"
            onError={() => {
              setImageError(true);
              setMedicineImage("/placeholder.svg");
            }}
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
            <PillBottle className="h-8 w-8 text-slate-400" />
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-slate-800">{medicine.name}</h3>
            <p className="text-sm text-slate-500">{medicine.description || "No description provided"}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            
            {onEdit && onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded-md hover:bg-slate-100">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2 cursor-pointer">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onDelete} 
                    className="flex items-center gap-2 text-red-500 cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
            {medicine.dosage}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lavender-100 text-lavender-800">
            {medicine.time}
          </span>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex items-center mt-3 md:mt-0">
        <button
          onClick={handleTakeMedicine}
          disabled={taken}
          className={`${
            taken 
              ? 'bg-green-100 text-green-500 cursor-not-allowed'
              : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
          } px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2`}
        >
          {taken ? (
            <>
              <CheckCircle size={18} />
              <span>Taken</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Mark as Taken</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
