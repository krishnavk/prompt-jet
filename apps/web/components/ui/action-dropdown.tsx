"use client";

import React, { useRef, useEffect, useState } from "react";
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
  type?: 'item' | 'header';
  label?: string; // For header type
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
  disabled?: boolean;
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
  disabled = false,
}: ActionDropdownProps) {
  const [currentHeader, setCurrentHeader] = useState<string>(label);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer to track visible headers
  useEffect(() => {
    if (!contentRef.current) return;

    const headers = Array.from(headerRefs.current.entries());
    if (headers.length === 0) return;

    const options = {
      root: contentRef.current,
      rootMargin: '-70px 0px 0px 0px', // Adjust this to control when the header changes
      threshold: 0.1,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headerId = entry.target.getAttribute('data-header-id');
          if (headerId) {
            const header = headers.find(([id]) => id === headerId);
            if (header) {
              setCurrentHeader(header[1].textContent || label);
            }
          } else {
            setCurrentHeader(label);
          }
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, options);
    headers.forEach(([id, element]) => {
      observer.current?.observe(element);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [label]);

  const getDisplayText = () => {
    // If we're showing a specific category, use that as the display text
    if (currentHeader !== label) {
      return currentHeader;
    }
    
    // Original display text logic
    if (selectedIds.length === 0) {
      return placeholder || `Select ${label}`;
    }
    
    if (selectedIds.length === 1) {
      const selectedOption = options.find(opt => opt.id === selectedIds[0]);
      return selectedOption?.name || placeholder || `Select ${label}`;
    }
    
    return `${selectedIds.length} selected`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`${triggerClassName} ${
            selectedIds.length > 0 ? 'bg-accent text-accent-foreground' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {getDisplayText()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={contentClassName}>
        <div className={`${maxHeight} overflow-y-auto`} ref={contentRef}>
          <div className="relative">
            {options.map((option, index, array) => {
              if (option.type === 'header') {
                const nextHeaderIndex = array.slice(index + 1).findIndex(opt => opt.type === 'header');
                const sectionItems = nextHeaderIndex === -1 
                  ? array.slice(index + 1) 
                  : array.slice(index + 1, index + 1 + nextHeaderIndex);
                
                return (
                  <div key={`section-${index}`}>
                    <div 
                      ref={(el) => {
                        if (el) {
                          headerRefs.current.set(`header-${index}`, el);
                        } else {
                          headerRefs.current.delete(`header-${index}`);
                        }
                      }}
                      data-header-id={`header-${index}`}
                      className="sticky top-0 z-20 px-3 py-2 text-sm font-medium bg-popover border-b"
                    >
                      {option.label}
                    </div>
                    {sectionItems.map((item) => (
                      item.type !== 'header' && (
                        <DropdownMenuCheckboxItem
                          key={item.id}
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => {
                            onSelectionChange(item.id, checked);
                            // Prevent the dropdown from closing
                            const event = window.event as Event;
                            if (event) {
                              event.stopPropagation();
                            }
                          }}
                          onSelect={(e) => {
                            // Prevent the dropdown from closing
                            e.preventDefault();
                          }}
                          disabled={item.disabled}
                          className={item.disabled ? "opacity-50" : ""}
                        >
                          {item.name}
                        </DropdownMenuCheckboxItem>
                      )
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}