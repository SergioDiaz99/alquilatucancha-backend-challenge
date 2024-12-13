import { Available, CourtAttributes, Sport } from './submodels';

export interface Court {
  id: number;
  name: string;
  attributes: CourtAttributes;
  sports: Sport[];
  available: Available[];
}
