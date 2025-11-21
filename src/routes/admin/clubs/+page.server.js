import { getKnex } from '$lib/server/db/knex.js';

export async function load() {
    const knex = getKnex();
    const clubs = await knex('clubs')
        .orderBy('name', 'asc')
        .select(
            'id',
            'name',
            'description',
            'location',
            'member_count',
            'balance',
            'provider_club_id',
            'created_at'
        );
    return { clubs };
}
