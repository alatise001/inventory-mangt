import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
// const prisma = new PrismaClient();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");
    const memberEmail = searchParams.get("memberEmail");

    const participants = await prisma.participants.findMany({
      where: {
        membershipNo: memberId || undefined,
        email: memberEmail || undefined,
      },
    });

    if (!participants) {
      return new NextResponse(
        JSON.stringify({ error: "No participant found" }),
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Participant fetched successfully",
        data: participants,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error in fetching participant: " + message },
      { status: 500 },
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const participantId = searchParams.get("id");

    if (!participantId) {
      return new NextResponse(
        JSON.stringify({ error: "Participant ID is required" }),
        { status: 400 },
      );
    }

    const body = await req.json();
    const { conferenceItems } = body;

    if (!conferenceItems) {
      return new NextResponse(
        JSON.stringify({ error: "Conference items data is required" }),
        { status: 400 },
      );
    }

    // Get the current participant to check if they're in a group
    const currentParticipant = await prisma.participants.findUnique({
      where: { id: participantId },
    });

    if (!currentParticipant) {
      return new NextResponse(
        JSON.stringify({ error: "Participant not found" }),
        { status: 404 },
      );
    }

    // Normalize conference items with defaults
    const normalizedItems = {
      cap: conferenceItems.cap ?? false,
      notebook: conferenceItems.notebook ?? false,
      pen: conferenceItems.pen ?? false,
      tshirt: conferenceItems.tshirt ?? false,
      waterBottle: conferenceItems.waterBottle ?? false,
    };

    // Check if participant is in a group
    const isInGroup =
      currentParticipant.group && currentParticipant.group.trim() !== "";

    if (isInGroup) {
      // Get all members of the group
      const groupMembers = await prisma.participants.findMany({
        where: { group: currentParticipant.group },
      });

      const groupMemberCount = groupMembers.length;

      // Check each item: only mark as collected if ALL group members get it
      // For this, we need to know how many of each item are being collected
      // Since we're just toggling checkboxes, we assume if checked = true,
      // it means ALL members got that item
      const finalItems = { ...normalizedItems };

      // Determine collection status based on items
      const itemValues = Object.values(finalItems);
      const trueCount = itemValues.filter(Boolean).length;

      let collectionStatus;
      if (trueCount === 5) {
        collectionStatus = "completed";
      } else if (trueCount === 0) {
        collectionStatus = "not_started";
      } else {
        collectionStatus = "in_progress";
      }

      // Update ALL group members with the same conference items and status
      await prisma.participants.updateMany({
        where: { group: currentParticipant.group },
        data: {
          conferenceItems: finalItems,
          collectionStatus: collectionStatus,
          groupCollectedBy: currentParticipant.name,
        },
      });

      // Fetch the updated participant to return
      const updatedParticipant = await prisma.participants.findUnique({
        where: { id: participantId },
      });

      return new NextResponse(
        JSON.stringify({
          message: `Conference items updated successfully for all ${groupMemberCount} group members`,
          data: updatedParticipant,
          groupUpdate: true,
          groupMemberCount: groupMemberCount,
        }),
        { status: 200 },
      );
    } else {
      // Individual participant (not in a group)
      const itemValues = Object.values(normalizedItems);
      const trueCount = itemValues.filter(Boolean).length;

      let collectionStatus;
      if (trueCount === 5) {
        collectionStatus = "completed";
      } else if (trueCount === 0) {
        collectionStatus = "not_started";
      } else {
        collectionStatus = "in_progress";
      }

      const updatedParticipant = await prisma.participants.update({
        where: {
          id: participantId,
        },
        data: {
          conferenceItems: normalizedItems,
          collectionStatus: collectionStatus,
        },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Conference items updated successfully",
          data: updatedParticipant,
          groupUpdate: false,
        }),
        { status: 200 },
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      JSON.stringify({ error: "Error updating conference items: " + message }),
      { status: 500 },
    );
  }
};
