import { getKnex } from '$lib/server/db/knex.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const knex = getKnex();
    const { id } = params;

    const club = await knex('clubs').where({ id }).first();
    if (!club) throw error(404, 'Club not found');

    const members = await knex('user_clubs')
        .join('users', 'user_clubs.user_id', 'users.id')
        .where('user_clubs.club_id', id)
        .select(
            'users.id',
            'users.first_name',
            'users.last_name',
            'users.email',
            'users.username',
            'user_clubs.role',
            'user_clubs.joined_at'
        )
        .orderBy('user_clubs.joined_at', 'desc');

    return { club, members };
}
