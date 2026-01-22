import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { membershipNo, email } = await request.json();

        if (!membershipNo && !email) {
            return Response.json(
                { error: 'Either membershipNo or email is required' },
                { status: 400 }
            );
        }

        const filePath = path.join(process.cwd(), 'participantrecord.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const participants = JSON.parse(fileContent);

        const attendee = participants.find(
            (item) => item.membershipNo === membershipNo || item.email === email
        );

        if (!attendee) {
            return Response.json(
                { error: 'Attendee not found' },
                { status: 404 }
            );
        }

        return Response.json({ success: true, data: attendee });
    } catch (error) {
        console.error('Error fetching attendee:', error);
        return Response.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
