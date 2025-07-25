"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  id: string;
  name: string;
  disabled?: boolean;
}

interface ActionDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedIds: string[];
  onSelectionChange: (id: string, checked: boolean) => void;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
  maxHeight?: string;
}

export function ActionDropdown({
  label,
  options,
  selectedIds,
  onSelectionChange,
  placeholder,
  triggerClassName = "w-auto min-w-56 justify-between",
  contentClassName = "w-auto min-w-56",
  maxHeight = "max-h-80",
}: ActionDropdownProps) {
  const getDisplayText = () => {
    if (selectedIds.length === 0) {
      return placeholder || `Select ${label}`;
    }
    
    if (selectedIds.length === 1) {
      const selectedOption = options.find(opt => opt.id === selectedIds[0]);
      return selectedOption?.name || placeholder || `Select ${label}`;
    }
    
    return `${selectedIds.length} ${label.toLowerCase()}${selectedIds.length > 1 ? 's' : ''} selected`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          {getDisplayText()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={contentClassName}>
        <div className={`${maxHeight} overflow-y-auto overflow-x-hidden`}>
          <DropdownMenuLabel className="sticky top-0 bg-popover z-10">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="sticky bg-popover z-10" />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={selectedIds.includes(option.id)}
              onCheckedChange={(checked) => onSelectionChange(option.id, checked)}
              disabled={option.disabled}
              className={option.disabled ? "opacity-50" : ""}
            >
              {option.name}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}