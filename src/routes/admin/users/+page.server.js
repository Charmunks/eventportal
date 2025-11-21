import { getKnex } from '$lib/server/db/knex.js';
import { error } from '@sveltejs/kit';

export async function load() {
    const knex = getKnex();
    const users = await knex('users')
        .orderBy('created_at', 'desc')
        .select(
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'identity_verified',
            'is_admin',
            'created_at'
        );
    return { users };
}

export const actions = {
    toggleAdmin: async ({ request, locals }) => {
        if (!locals.userPublic?.isAdmin) {
            throw error(403, 'Forbidden');
        }
        
        const formData = await request.formData();
        const userId = formData.get('userId');
        const isAdmin = formData.get('isAdmin') === 'true';
        
        const knex = getKnex();
        await knex('users')
            .where({ id: userId })
            .update({ is_admin: !isAdmin });
            
        return { success: true };
    },
    
    delete: async ({ request, locals }) => {
        if (!locals.userPublic?.isAdmin) {
            throw error(403, 'Forbidden');
        }
        
        const formData = await request.formData();
        const userId = formData.get('userId');
        
        // Prevent deleting yourself
        if (String(userId) === String(locals.userPublic.id)) {
            return { success: false, message: 'Cannot delete yourself' };
        }
        
        const knex = getKnex();
        await knex('users').where({ id: userId }).delete();
        
        return { success: true };
    }
};
