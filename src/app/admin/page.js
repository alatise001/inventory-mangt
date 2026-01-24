'use client'
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { FormContext } from "@/contexts/formContext";
import { useRouter } from "next/navigation";


import CheckedTable from "@/components/table";
import memberdata from "../../../participantrecord.json";


const formSchema = z.object({
  membershipNo: z
    .string()
    .trim()
    .optional(),

  emailAddress: z
    .string()
    .trim()
    .optional()
})
  .refine(
    (data) => {
      const hasMembershipNo = data.membershipNo && data.membershipNo.length > 0;
      const hasEmail = data.emailAddress && data.emailAddress.length > 0;
      return hasMembershipNo || hasEmail;
    },
    {
      message: "Please provide either a membership number or email address",
      path: ["membershipNo"]
    }
  )
  .refine(
    (data) => {
      if (!data.emailAddress || data.emailAddress.length === 0) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(data.emailAddress);
    },
    {
      message: "Invalid email address",
      path: ["emailAddress"]
    }
  )

export default function Home() {
  const router = useRouter();
  const { isform, setFormData } = React.useContext(FormContext);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membershipNo: "",
      emailAddress: ""

    },
  })


  function onSubmit(data) {

    const attendee = memberdata.find(item => item?.membershipNo === data?.membershipNo || item?.email === data?.emailAddress);
    // console.log(attendee);

    setFormData(prev => ({
      ...prev,
      adminmembershipNo: data.membershipNo,
      adminemailAddress: data.emailAddress,
    }));
    // console.log(data);
    router.push("/admin/userInfo");
  }


  return (
    <div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-5 p-6  bg-white/10 rounded-lg shadow-md backdrop-blur-sm">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>


      <Tabs defaultValue="attendeeInfo" className="w-full">


        <TabsList className='flex gap-3 self-start'>
          <TabsTrigger value="attendeeInfo">Attendee&apos;s</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>


        <TabsContent className='flex flex-col gap-3' value="attendeeInfo">

          <div className="flex flex-col mt-4 gap-2.5">

            <h2 className="text-md">
              Find attendee by scanning their QR code
            </h2>

            <p className="text-xl">
              OR
            </p>


            <h2 className="text-md">
              Enter their
              membership number or email address
            </h2>
          </div>



          <form id="form-rhf-demo" className="flex flex-col mt-5 gap-5" onSubmit={form.handleSubmit(onSubmit)}>


            <FieldGroup className="flex flex-col gap-4">
              <Controller
                name="membershipNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-membership-no">
                      Membership No (must be in capital letters e.g MB*****)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-membership-no"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your membership number"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <p className="text-sm">
                OR
              </p>

              <Controller
                name="emailAddress"
                control={form.control}
                render={({ field, fieldState }) => (

                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email-address">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email-address"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email address"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

            </FieldGroup>
          </form>


          <Field className='mt-10' orientation="horizontal">
            {/* <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button> */}

            <Button type="submit" variant="outline" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </TabsContent>

        <TabsContent value="completed">
          <CheckedTable />
        </TabsContent>


      </Tabs>
    </div>
  );
}





// <Field orientation="horizontal">
//   <Button type="submit">Submit</Button>
//   <Button variant="outline" type="button">
//     Cancel
//   </Button>
// </Field>
{/* <Image
  className="dark:invert"
  src="/vercel.svg"
  alt="Vercel logomark"
  width={16}
  height={16}
/> */}


{/* <Image
  className="dark:invert"
  src="/next.svg"
  alt="Next.js logo"
  width={100}
  height={20}
  priority
/> */}