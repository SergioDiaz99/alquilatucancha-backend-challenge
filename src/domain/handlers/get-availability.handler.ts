import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as NodeCache from 'node-cache';

import {
  ClubWithAvailability,
  GetAvailabilityQuery,
} from '../commands/get-availaiblity.query';
import {
  ALQUILA_TU_CANCHA_CLIENT,
  AlquilaTuCanchaClient,
} from '../ports/aquila-tu-cancha.client';

@QueryHandler(GetAvailabilityQuery)
export class GetAvailabilityHandler
  implements IQueryHandler<GetAvailabilityQuery>
{
  private cache: NodeCache;

  constructor(
    @Inject(ALQUILA_TU_CANCHA_CLIENT)
    private alquilaTuCanchaClient: AlquilaTuCanchaClient,
  ) {
    // Tiempo de expiración de caché en segundos
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutos
  }

  async execute(query: GetAvailabilityQuery): Promise<ClubWithAvailability[]> {
    const cacheKey = `availability:${query.placeId}:${query.date}`;

    // Intenta obtener datos del caché
    const cachedData = this.cache.get<ClubWithAvailability[]>(cacheKey);
    //Si encuentra la cache, retorna el objeto, de lo contrario, busca en la API
    if (cachedData) return cachedData;
    //
    const clubs = await this.alquilaTuCanchaClient.getClubs(query.placeId);

    const clubs_with_availability = await Promise.all(
      clubs.map(async (club) => {
        const courts = await this.alquilaTuCanchaClient.getCourts(club.id);

        const courts_with_availability = await Promise.all(
          courts.map(async (court) => {
            const slots = await this.alquilaTuCanchaClient.getAvailableSlots(
              club.id,
              court.id,
              query.date,
            );
            return { ...court, available: slots };
          }),
        );

        return { ...club, courts: courts_with_availability };
      }),
    );

    // Almacena el resultado en caché
    this.cache.set(cacheKey, clubs_with_availability);

    return clubs_with_availability;
  }
}
