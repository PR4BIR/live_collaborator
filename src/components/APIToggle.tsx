"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface APIToggleProps {
  useMockAPI: boolean;
  onToggle: (value: boolean) => void;
}

export function APIToggle({ useMockAPI, onToggle }: APIToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="mock-api" 
        checked={useMockAPI} 
        onCheckedChange={onToggle} 
      />
      <Label htmlFor="mock-api" className="text-xs">
        Use Mock API
      </Label>
    </div>
  );
}
