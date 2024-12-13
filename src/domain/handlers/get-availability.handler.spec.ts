import * as moment from 'moment';

import { AlquilaTuCanchaClient } from '../../domain/ports/aquila-tu-cancha.client';
import { GetAvailabilityQuery } from '../commands/get-availaiblity.query';
import { Club } from '../model/club';
import { Court } from '../model/court';
import { Slot } from '../model/slot';
import { GetAvailabilityHandler } from './get-availability.handler';

describe('GetAvailabilityHandler', () => {
  let handler: GetAvailabilityHandler;
  let client: FakeAlquilaTuCanchaClient;

  beforeEach(() => {
    client = new FakeAlquilaTuCanchaClient();
    handler = new GetAvailabilityHandler(client);
  });

  it('returns the availability from cache if available', async () => {
    const placeId = '123';
    const date = moment('2022-12-05').toDate();

    // Setup cache data
    const cacheKey = `availability:${placeId}:${date}`;
    const cachedData = [{ id: 1, courts: [{ id: 1, available: [] }] }];
    client.cache.set(cacheKey, cachedData);

    const response = await handler.execute(
      new GetAvailabilityQuery(placeId, date),
    );

    expect(response).toEqual(cachedData); // Verifica que se devuelva el resultado desde la cache
  });

  it('fetches from the API when cache is not available', async () => {
    client.clubs = { '123': [{ id: 1 }] };
    client.courts = { '1': [{ id: 1 }] };
    client.slots = { '1_1_2022-12-05': [] };

    const placeId = '123';
    const date = moment('2022-12-05').toDate();

    const response = await handler.execute(
      new GetAvailabilityQuery(placeId, date),
    );

    // Verifica que se obtuvo el resultado de la API
    expect(response).toEqual([{ id: 1, courts: [{ id: 1, available: [] }] }]);
  });
});

class FakeAlquilaTuCanchaClient implements AlquilaTuCanchaClient {
  clubs: Record<string, Club[]> = {};
  courts: Record<string, Court[]> = {};
  slots: Record<string, Slot[]> = {};
  cache: Map<
    string,
    { id: number; courts: { id: number; available: boolean[][] }[] }[]
  > = new Map();
  async getClubs(placeId: string): Promise<Club[]> {
    return this.clubs[placeId];
  }
  async getCourts(clubId: number): Promise<Court[]> {
    return this.courts[String(clubId)];
  }
  async getAvailableSlots(
    clubId: number,
    courtId: number,
    date: Date,
  ): Promise<Slot[]> {
    return this.slots[
      `${clubId}_${courtId}_${moment(date).format('YYYY-MM-DD')}`
    ];
  }
}
