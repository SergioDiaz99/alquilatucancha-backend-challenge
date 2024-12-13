import { Court } from './court';
import { Location, OpenHours, Props, Zone } from './submodels';

export interface Club {
  id: number;
  permalink: string;
  name: string;
  logo: string;
  logo_url: string;
  background: string;
  background_url: string;
  location: Location;
  zone: Zone;
  props: Props;
  attributes: string[];
  openhours: OpenHours[];
  _priority: number;
  courts: Court[];
}
