"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { BusinessCard } from "@/types";

interface QuickActionsProps {
  card: BusinessCard;
  onEdit?: (card: BusinessCard) => void;
  onDelete?: (card: BusinessCard) => void;
}

export function QuickActions({ card, onEdit, onDelete }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Using HTMLDivElement as DropdownMenuItem renders as a div
  const handleView = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/card/${card.id}`);
  };

  const handleEdit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(card);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={5}
              className="w-48 bg-card/95 backdrop-blur-sm border-border/70 shadow-lg rounded-lg overflow-hidden animate-in zoom-in-90 duration-200"
            >
              <DropdownMenuItem
                className="focus:bg-muted cursor-pointer gap-2 py-1.5"
                onClick={handleView}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="focus:bg-muted cursor-pointer gap-2 py-1.5"
                onClick={handleEdit}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-border/40" />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2 py-1.5"
                onClick={handleDelete}
              >
                <Trash className="w-3.5 h-3.5" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="text-xs bg-card/95 backdrop-blur-sm"
        >
          <span>Actions</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
