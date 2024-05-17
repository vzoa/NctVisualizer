import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val;
}

export function logIfDev(message?: any, ...optionalParams: any[]) {
  if (import.meta.env.DEV) {
    console.log(message, ...optionalParams);
  }
}
