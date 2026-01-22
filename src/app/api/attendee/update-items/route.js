import fs from 'fs';
import path from 'path';

// Path to the participant record JSON file
const filePath = path.join(process.cwd(), 'participantrecord.json');

export async function POST(request) {
    try {
        const { membershipNo, conferenceItems, collectionStatus } = await request.json();

        // Validate required fields
        if (!membershipNo || !conferenceItems || !collectionStatus) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields: membershipNo, conferenceItems, collectionStatus'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Read the JSON file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const participants = JSON.parse(fileContent);

        // Find and update the participant
        const participantIndex = participants.findIndex(
            p => p.membershipNo === membershipNo
        );

        if (participantIndex === -1) {
            return new Response(
                JSON.stringify({ error: 'Attendee not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Update the participant record
        participants[participantIndex].conferenceItems = conferenceItems;
        participants[participantIndex].collectionStatus = collectionStatus;

        // Write back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(participants, null, 1));

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Items updated successfully',
                data: {
                    membershipNo,
                    conferenceItems,
                    collectionStatus
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error updating items:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update items', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
