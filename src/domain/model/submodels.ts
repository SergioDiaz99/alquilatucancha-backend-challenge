export interface Location {
  name: string;
  city: string;
  lat: string;
  lng: string;
}

interface Country {
  id: number;
  name: string;
  iso_code: string;
}

export interface Zone {
  id: number;
  name: string;
  full_name: string;
  placeid: string;
  country: Country;
}

export interface Props {
  sponsor: boolean;
  favorite: boolean;
  stars: string;
  payment: boolean;
}

export interface OpenHours {
  day_of_week: number;
  open_time: number;
  close_time: number;
  open: boolean;
}

export interface CourtAttributes {
  floor: string;
  light: boolean;
  roofed: boolean;
  beelup: boolean;
}

interface Pivot {
  court_id: number;
  sport_id: number;
  enabled: number;
}

export interface Sport {
  id: number;
  parent_id: number | null;
  name: string;
  players_max: number;
  order: number;
  default_duration: number;
  divisible_duration: number;
  icon: string;
  pivot: Pivot;
}

export interface Available {
  price: number;
  duration: number;
  datetime: string;
  start: string;
  end: string;
  _priority: number;
}
