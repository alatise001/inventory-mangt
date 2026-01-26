import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "./loading";

// console.log(data);

export default function CheckedTable() {
  const [isAttendee, setIsAttendee] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [emptyState, setEmptyState] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fecthAttendee = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/participants`);
        const data = await response.json();
        if (response.ok && data.data.length > 0) {
          // console.log(data);
          const attendee = data.data;
          setIsAttendee(attendee);
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
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (emptyState) {
    return (
      <div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-10 p-6 bg-white/10 rounded-lg">
        <h2 className="text-2xl font-semibold">Attendee Not Found</h2>
        <p>
          No attendee found with membership number: {membershipNo} or email:{" "}
          {email}
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const filteredAttendees = (isAttendee || []).filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const tokens = term.split(/\s+/).filter(Boolean);
    const haystack = [item?.membershipNo, item?.name, item?.email]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    return tokens.every((token) =>
      haystack.some(
        (value) => value.startsWith(token) || value.includes(token),
      ),
    );
  });

  return (
    <div className="h-96 lg:h-[65vh] w-full overflow-y-scroll">
      <div className="mb-3 w-[80%]">
        <input
          type="text"
          placeholder="Search by membership no, name, or email"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>
      <Table>
        <TableCaption>A list of complete collections.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Membership No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAttendees.map((item) => (
            <TableRow key={item?.membershipNo}>
              <TableCell className="font-medium">
                {item?.membershipNo}
              </TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell className="text-right">
                {item.collectionStatus}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
}
