import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

import { Club } from '../../domain/model/club';
import { Court } from '../../domain/model/court';
import { Slot } from '../../domain/model/slot';
import { AlquilaTuCanchaClient } from '../../domain/ports/aquila-tu-cancha.client';

const mockedData = require('../../../mock/data/ChIJoYUAHyvmopUR4xJzVPBE_Lw.json').data;

@Injectable()
export class HTTPAlquilaTuCanchaClient implements AlquilaTuCanchaClient {
  private base_url: string;
  constructor(private httpService: HttpService, config: ConfigService) {
    this.base_url = config.get<string>('ATC_BASE_URL', 'http://localhost:4000');
  }

  async getClubs(placeId: string): Promise<Club[]> {
    return this.httpService.axiosRef
      .get('clubs', {
        baseURL: this.base_url,
        params: { placeId },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`API failed for getClubs: ${error.message}`);
        return mockedData.map((club) => ({
          id: club.id,
          name: club.name,
          logo: club.logo_url,
        }));
      });
  }

  getCourts(clubId: number): Promise<Court[]> {
    return this.httpService.axiosRef
      .get(`/clubs/${clubId}/courts`, {
        baseURL: this.base_url,
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`API failed for getCourts: ${error.message}`);
        const club = mockedData.find((c) => c.id === clubId);
        return club ? club.courts : [];
      });
  }

  getAvailableSlots(
    clubId: number,
    courtId: number,
    date: Date,
  ): Promise<Slot[]> {
    return this.httpService.axiosRef
      .get(`/clubs/${clubId}/courts/${courtId}/slots`, {
        baseURL: this.base_url,
        params: { date: moment(date).format('YYYY-MM-DD') },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`API failed for getAvailableSlots: ${error.message}`);
        const club = mockedData.find((c) => c.id === clubId);
        const court = club?.courts.find((c) => c.id === courtId);
        return court ? court.available : [];
      });
  }
}
