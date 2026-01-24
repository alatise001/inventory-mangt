import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
// const prisma = new PrismaClient();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group");

    let participants;

    if (group) {
      // Fetch participants by group
      participants = await prisma.participants.findMany({
        where: { group: group },
      });
    } else {
      // Fetch all participants
      participants = await prisma.participants.findMany();
    }

    if (!participants || participants.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No participants found" }),
        {
          status: 404,
        },
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Participants fetched successfully",
        data: participants,
      }),
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in fetching participants: " + message, {
      status: 500,
    });
  }
};
