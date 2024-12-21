import React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchAndFilterSection() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="flex-1">
        <Input placeholder="Search projects..." className="w-full" />
      </div>
      <div className="flex gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="web">Web Development</SelectItem>
            <SelectItem value="mobile">Mobile Apps</SelectItem>
            <SelectItem value="ai">AI/ML</SelectItem>
            <SelectItem value="blockchain">Blockchain</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="active">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
