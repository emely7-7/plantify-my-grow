export interface Plant {
  id: string;
  name: string;
  species: string;
  imageUrl: string;
  wateringFrequency: number;
  sunlight: "low" | "medium" | "high";
  status: "healthy" | "needs-water" | "normal";
  lastWatered: string;
  location?: string;
}

export interface CareEvent {
  id: string;
  plantId: string;
  type: "water" | "fertilize" | "prune" | "repot";
  date: string;
  notes?: string;
}
