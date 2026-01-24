'use client'
import Image from "next/image";
import React, { Suspense } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ProductCheckboxes } from "@/components/productCheckboxes";
import { useSearchParams, useRouter } from "next/navigation";
import { FormContext } from "@/contexts/formContext";
import Loading from "@/components/loading";

function UserInformationContent() {


  const router = useRouter();
  const searchParams = useSearchParams();
  const membershipNo = searchParams.get('membershipNo');
  const email = searchParams.get('email');

  const { isform, setFormData } = React.useContext(FormContext);

  const [isAttendee, setIsAttendee] = React.useState();
  const [groupMemberCount, setGroupMemberCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [emptyState, setEmptyState] = React.useState(false);

  React.useEffect(() => {
    const fecthAttendee = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/participants/info?memberId=${isform.adminmembershipNo}&memberEmail=${isform.adminemailAddress}`);
        const data = await response.json();
        if (response.ok && data.data.length > 0) {
          // console.log(data);
          const attendee = data.data[0];
          setIsAttendee(attendee);
          setLoading(false);

          // Fetch group member count if participant is in a group
          if (attendee.group && attendee.group.trim() !== "") {
            const groupResponse = await fetch(`/api/participants?group=${encodeURIComponent(attendee.group)}`);
            const groupData = await groupResponse.json();
            if (groupResponse.ok) {
              setGroupMemberCount(groupData.data.length);
            }
          } else {
            setGroupMemberCount(0);
          }
        } else if (response.ok && data.data.length === 0) {
          // setIsAttendee(null);
          setEmptyState(true);
          setLoading(false);
        } else {
          setIsAttendee(null);
          setGroupMemberCount(0);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching attendee:", error);
        setIsAttendee(null);
        setLoading(false);
      }
    };
    fecthAttendee();
  }, [isform]);

  // React.useEffect(() => {
  //   setIsAttendee(attendee || isform ? isform.adminattendees : null);
  // }, [attendee, isform]);



  const handleSaveItems = async (updatedData) => {
    try {
      const response = await fetch(`/api/participants/info?id=${isAttendee.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conferenceItems: updatedData.conferenceItems
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save items');
      }

      const result = await response.json();

      // Update local state with fresh data
      setIsAttendee(result.data);

      return result;
    } catch (error) {
      console.error('Error saving items:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (emptyState) {
    return (
      <div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-10 p-6 bg-white/10 rounded-lg">
        <h2 className="text-2xl font-semibold">Attendee Not Found</h2>
        <p>No attendee found with membership number: {membershipNo} or email: {email}</p>
        <button onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-blue-700">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-[90%] items-center pt-4 rounded-[30px] border border-[rgba(238,238,238,0.80)] shadow-[0_0_12px_4px_rgba(255,255,255,0.01)_inset,0_42px_25px_0_rgba(0,0,0,0.05),0_5px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-lg flex flex-col gap-6 max-w-md text-white mx-auto mt-5 p-6  bg-white/10">

      <h1 className="text-3xl font-bold">Admin DashBoard</h1>

      <Tabs defaultValue="attendeeInfo" className="self-center w-full gap-5">
        <TabsList className='flex self-center'>
          <TabsTrigger value="attendeeInfo">Attendee&apos;s Info</TabsTrigger>
          <TabsTrigger value="product">Conference Materials</TabsTrigger>
        </TabsList>
        <TabsContent value="attendeeInfo">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-2xl font-semibold mb-2">{isAttendee.name}</h2>
            <p className="text-md">Membership No: {isAttendee.membershipNo}</p>
            <p className="text-md">Email: {isAttendee.email}</p>
            <p className="text-md">Phone Number: {isAttendee.phoneNo}</p>
            <p className="text-md">Gender: {isAttendee.gender}</p>
            <p className="text-md">T-shirt Size: {isAttendee.shirtSize}</p>
            <p className="text-md">District Society: {isAttendee.districtSociety}</p>
            <p className="text-md">Member&apos;s Status: {isAttendee.membershipStatus}</p>
            <p className="text-md">Membership Type: {isAttendee.membershipType}</p>
            <p className="text-md">Participant Type: {isAttendee.participationType}</p>

            {isAttendee.group && isAttendee.group.trim() !== "" && (
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                <p className="text-md font-semibold">Group Information:</p>
                <p className="text-md">This person is in group: <span className="font-bold">{isAttendee.group}</span></p>
                <p className="text-md">Group has {groupMemberCount} member{groupMemberCount !== 1 ? 's' : ''}</p>
                {isAttendee.groupCollectedBy && (
                  <p className="text-md">Collected by: {isAttendee.groupCollectedBy}</p>
                )}
                <p className="text-sm mt-2 text-yellow-300">⚠️ Updating items will affect all group members</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="product">

          <ProductCheckboxes
            attendeeData={isAttendee}
            onSave={handleSaveItems}
            isAdmin={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function UserInformation() {
  return (
    <Suspense fallback={<div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-10 p-6 bg-white/10 rounded-lg">Loading...</div>}>
      <UserInformationContent />
    </Suspense>
  );
}