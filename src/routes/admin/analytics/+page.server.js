import { getKnex } from '$lib/server/db/knex.js';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '$env/static/private';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function load() {
    const knex = getKnex();

    // 1. Fetch Event Completions
    const completions = await knex('user_completed_events')
        .select('event_id')
        .count('event_id as count')
        .groupBy('event_id')
        .orderBy('count', 'desc');

    // 2. Fetch Event Details from Airtable
    let eventsMap = new Map();
    try {
        const records = await base(AIRTABLE_TABLE_NAME)
            .select({
                fields: ['title', 'category']
            })
            .all();
        
        records.forEach(record => {
            eventsMap.set(record.id, {
                title: record.get('title'),
                category: record.get('category')
            });
        });
    } catch (error) {
        console.error('Error fetching events for analytics:', error);
    }

    // Combine completions with event details
    const eventStats = completions.map(c => ({
        id: c.event_id,
        title: eventsMap.get(c.event_id)?.title || 'Unknown Event',
        category: eventsMap.get(c.event_id)?.category || 'Unknown',
        count: parseInt(c.count)
    }));

    // 3. Fetch Club Ships
    const clubs = await knex('clubs').select('id', 'name', 'ships');
    
    let totalShips = 0;
    let allShips = [];
    let shipsByName = {};

    clubs.forEach(club => {
        if (club.ships) {
            // clubs.ships is JSONB, so knex/pg might return it as object already
            // but in migration it was t.jsonb('ships').defaultTo('[]')
            // let's ensure it's an array
            let clubShips = club.ships;
            if (typeof clubShips === 'string') {
                try {
                    clubShips = JSON.parse(clubShips);
                } catch (e) {
                    clubShips = [];
                }
            }
            
            if (Array.isArray(clubShips)) {
                totalShips += clubShips.length;
                clubShips.forEach(ship => {
                    allShips.push({
                        name: ship.name,
                        codeUrl: ship.codeUrl,
                        memberName: ship.memberName,
                        // Add safe club info
                        clubName: club.name,
                        clubId: club.id
                    });

                    const shipName = ship.name || 'Unnamed Ship';
                    shipsByName[shipName] = (shipsByName[shipName] || 0) + 1;
                });
            }
        }
    });

    // Sort top shipped projects
    const topShips = Object.entries(shipsByName)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

    // Recent ships (just taking the first 20 from the aggregated list effectively)
    // Note: We don't have a date on the ship object itself in the JSON structure derived from `sync-clubs.js`
    // So we can't truly sort by "recent" unless we rely on array order which might be arbitrary or sync order.
    // We will just display a sample.
    const recentShipsSample = allShips.slice(0, 20);

    return {
        eventStats,
        shipStats: {
            totalShips,
            avgShipsPerClub: clubs.length > 0 ? (totalShips / clubs.length).toFixed(1) : 0,
            topShips,
            sampleShips: recentShipsSample
        }
    };
}
