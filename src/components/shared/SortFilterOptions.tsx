
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterOptionProps {
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export const FilterOption: React.FC<FilterOptionProps> = ({ 
  label, 
  options, 
  selectedOption, 
  onChange 
}) => {
  return (
    <div>
      <label className="block text-crd-lightGray text-sm mb-2">{label}</label>
      <Button 
        variant="outline" 
        className="w-full bg-crd-dark text-crd-white border-crd-mediumGray rounded-md flex justify-between"
        onClick={() => {
          // In a real implementation, this would open a dropdown
          const nextIndex = (options.indexOf(selectedOption) + 1) % options.length;
          onChange(options[nextIndex]);
        }}
      >
        {selectedOption}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </Button>
    </div>
  );
};

interface SortFilterOptionsProps {
  onPriceChange?: (option: string) => void;
  onLikesChange?: (option: string) => void;
  onCreatorChange?: (option: string) => void;
}

export const SortFilterOptions: React.FC<SortFilterOptionsProps> = ({
  onPriceChange = () => {},
  onLikesChange = () => {},
  onCreatorChange = () => {}
}) => {
  const [priceSort, setPriceSort] = React.useState("Highest price");
  const [likesSort, setLikesSort] = React.useState("Most liked");
  const [creatorFilter, setCreatorFilter] = React.useState("Verified only");

  const handlePriceChange = (option: string) => {
    setPriceSort(option);
    onPriceChange(option);
  };

  const handleLikesChange = (option: string) => {
    setLikesSort(option);
    onLikesChange(option);
  };

  const handleCreatorChange = (option: string) => {
    setCreatorFilter(option);
    onCreatorChange(option);
  };

  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
      <FilterOption 
        label="PRICE" 
        options={["Highest price", "Lowest price", "Recently changed"]} 
        selectedOption={priceSort} 
        onChange={handlePriceChange}
      />
      
      <FilterOption 
        label="LIKES" 
        options={["Most liked", "Recently liked", "Trending"]} 
        selectedOption={likesSort} 
        onChange={handleLikesChange}
      />
      
      <FilterOption 
        label="CREATOR" 
        options={["Verified only", "All creators", "Following"]} 
        selectedOption={creatorFilter} 
        onChange={handleCreatorChange}
      />
    </div>
  );
};
