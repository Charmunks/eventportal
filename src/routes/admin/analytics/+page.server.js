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

    // 3. Fetch Club Ships directly from Airtable
    const dbClubs = await knex('clubs').select('id', 'name');
    
    let totalShips = 0;
    let allShips = [];
    let shipsByName = {};

    try {
  
        const shipRecords = await base('Club Ships')
            .select({
                fields: ['YSWS–Name (from Unified YSWS Database)', 'code_url', 'member_name', 'club_name (from Clubs)']
            })
            .all();

        // Create a map of club name -> club id for quick lookup
        const clubNameMap = new Map(dbClubs.map(c => [c.name, c.id]));

        shipRecords.forEach(record => {
            const clubNames = record.get('club_name (from Clubs)');
            // clubNames is usually an array of strings in Airtable linked records
            const clubName = Array.isArray(clubNames) ? clubNames[0] : clubNames;
            
            // Only count ships that belong to clubs in our DB
            if (clubName && clubNameMap.has(clubName)) {
                const ship = {
                    name: record.get('YSWS–Name (from Unified YSWS Database)') || 'Unnamed Ship',
                    codeUrl: record.get('code_url') || null,
                    memberName: record.get('member_name') || null,
                    clubName: clubName,
                    clubId: clubNameMap.get(clubName)
                };

                allShips.push(ship);
                totalShips++;
                
                const shipName = ship.name;
                shipsByName[shipName] = (shipsByName[shipName] || 0) + 1;
            }
        });

    } catch (error) {
        console.error('Error fetching ships from Airtable:', error);
    }

    // Sort top shipped projects
    const topShips = Object.entries(shipsByName)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

    // Recent ships (Airtable returns roughly insertion order, so first page is usually oldest or unsorted unless specified)
    // We didn't sort by date, so this is just a sample.
    const recentShipsSample = allShips.slice(0, 20);

    return {
        eventStats,
        shipStats: {
            totalShips,
            avgShipsPerClub: dbClubs.length > 0 ? (totalShips / dbClubs.length).toFixed(1) : 0,
            topShips,
            sampleShips: recentShipsSample
        }
    };
}
