import { getKnex } from '$lib/server/db/knex.js';

export async function load() {
    const knex = getKnex();
    
    // Analytics
    const [userCount] = await knex('users').count('id as count');
    const [clubCount] = await knex('clubs').count('id as count');
    const [completedEventsCount] = await knex('user_completed_events').count('id as count');
    
    // Recent users
    const recentUsers = await knex('users')
        .orderBy('created_at', 'desc')
        .limit(5)
        .select('id', 'username', 'email', 'created_at');

    return {
        stats: {
            users: parseInt(userCount.count),
            clubs: parseInt(clubCount.count),
            completedEvents: parseInt(completedEventsCount.count)
        },
        recentUsers
    };
}
