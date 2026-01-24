'use client'
import Image from "next/image";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { FormContext } from "@/contexts/formContext";
import { useRouter } from "next/navigation";
import { ProductCheckboxes } from "@/components/productCheckboxes";
import Loading from "@/components/loading";

export default function UserInformation() {
  const router = useRouter();
  const { isform, setFormData } = React.useContext(FormContext);
  const [isAttendee, setIsAttendee] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [emptyState, setEmptyState] = React.useState(false);

  React.useEffect(() => {
    const fecthAttendee = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/participants/info?memberId=${isform.membershipNo}&memberEmail=${isform.emailAddress}`);
        const data = await response.json();
        if (response.ok && data.data.length > 0) {
          console.log(data);
          setIsAttendee(data.data[0]);
          setLoading(false);
        } else if (response.ok && data.data.length === 0) {
          // setIsAttendee(null);
          setEmptyState(true);
          setLoading(false);
        } else {
          setIsAttendee(null);
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

  if (loading) {
    return (
      <Loading />
    );
  }


  if (emptyState) {
    return (
      <div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-10 p-6 bg-white/10 rounded-lg">
        <h2 className="text-2xl font-semibold">Attendee Not Found</h2>
        <p>Please search for an attendee first</p>
        <button onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-blue-700">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-[90%] items-center pt-4 rounded-[30px] border border-[rgba(238,238,238,0.80)] shadow-[0_0_12px_4px_rgba(255,255,255,0.01)_inset,0_42px_25px_0_rgba(0,0,0,0.05),0_5px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-lg flex flex-col gap-6 max-w-md text-white mx-auto mt-5 p-6  bg-white/10">
      <>
        <div className="flex justify-center">
          <QRCodeCanvas
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin/userInfo?membershipNo=${isAttendee.membershipNo}&email=${isAttendee.email}`}
            size={264}
            level="H"
            includeMargin={true}
            className="border-[1.5px] border-white rounded-3xl"
          // onClick={() => { router.push('/admin/userInfo?membershipNo=' + isform.attendees.membershipNo + '&email=' + isform.attendees.email) }}
          />
        </div>

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
              <p className="text-md">Group: {isAttendee.group}</p>
            </div>
          </TabsContent>
          <TabsContent value="product">
            <ProductCheckboxes
              attendeeData={isAttendee}
            />
          </TabsContent>
        </Tabs>
      </>
    </div>
  );
}