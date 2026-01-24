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
      return NextResponse.json({ error: "No participants found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Participants fetched successfully",
        data: participants,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error in fetching participants: " + message },
      { status: 500 },
    );
  }
};
