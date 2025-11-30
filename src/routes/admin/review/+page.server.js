import Airtable from 'airtable';
import { AIRTABLE_API_KEY} from '$env/static/private';

export async function load() {
    var AIRTABLE_BASE_ID = 'appLfgyztvTfaKGNc';


    console.log('Loading review page...');
    console.log('API Key present:', !!AIRTABLE_API_KEY);
    console.log('Base ID:', AIRTABLE_BASE_ID);

    if (!AIRTABLE_API_KEY) {
        console.error('AIRTABLE_API_KEY is not defined');
        return { projects: [] };
    }

    const baseId = AIRTABLE_BASE_ID || 'appLfgyztvTfaKGNc';
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(baseId);
    
    try {
        const records = await base("Project Submission")
        .select({
            fields: ['Screenshot', 'Project file (STEP)', 'First Name', 'Last Name', 'Email', 'Birthday', 'Slack ID', 'GitHub Username', 'Address (Line 1)', 'Address (Line 2)', 'City', 'State / Province', 'ZIP / Postal Code', 'Country'],
            filterByFormula: "AND({Status} = 'pending')"
        }).all();
        
        console.log(`Found ${records.length} records`);
        return {
            projects: records.map(record => ({
                id: record.id,
                Screenshot: record.get('Screenshot'),
                ProjectFile: record.get('Project file (STEP)'),
                FirstName: record.get('First Name'),
                LastName: record.get('Last Name'),
                Email: record.get('Email'),
                Birthday: record.get('Birthday'),
                SlackID: record.get('Slack ID'),
                GitHubUsername: record.get('GitHub Username'),
                AddressLine1: record.get('Address (Line 1)'),
                AddressLine2: record.get('Address (Line 2)'),
                City: record.get('City'),
                StateProvince: record.get('State / Province'),
                ZipPostalCode: record.get('Zip / Postal Code'),
                Country: record.get('Country')
            }))
        };
    } catch (error) {
        console.error('Error loading projects from Airtable:', error);
        return { projects: [], error: error.message };
    }
}
