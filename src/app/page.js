'use client'
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
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
  // console.log(data);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membershipNo: "",
      emailAddress: ""

    },
  })


  function onSubmit(data) {
    // const attendee = memberdata.filter(item => item?.membershipNo === data?.membershipNo || item?.email === data?.emailAddress);


    setFormData(prev => ({
      ...prev,
      membershipNo: data.membershipNo,
      emailAddress: data.emailAddress,
    }));
    // console.log(data);
    router.push("/userInfo");
  }


  return (
    <div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-md backdrop-blur-sm">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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


      <Field orientation="horizontal">
        {/* <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button> */}

        <Button type="submit" variant="outline" form="form-rhf-demo">
          Submit
        </Button>
      </Field>

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