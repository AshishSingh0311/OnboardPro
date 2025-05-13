import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number, fractionDigits = 1): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function getStatusBadgeVariant(value: number): "outline" | "secondary" | "destructive" {
  if (value < 0.3) return "outline";
  if (value < 0.7) return "secondary";
  return "destructive";
}

export function getSeverityLabel(severity: number): string {
  if (severity < 3) return "Mild";
  if (severity < 7) return "Moderate";
  return "Severe";
}

export function getUrgencyLabel(urgency: number): string {
  if (urgency < 3) return "Low";
  if (urgency < 7) return "Medium";
  return "High";
}

export const fileTypeIcons: Record<string, string> = {
  "eeg": "activity",
  "edf": "activity",
  "wav": "mic",
  "mp3": "mic",
  "txt": "file-text",
  "jpg": "image",
  "jpeg": "image",
  "png": "image",
  "csv": "file-spreadsheet",
  "json": "braces",
  "default": "file"
};

export function getFileTypeIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return fileTypeIcons[extension] || fileTypeIcons.default;
}
