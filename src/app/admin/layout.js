
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
import { useRouter } from "next/navigation";
import { FormContext } from "@/contexts/formContext";

const formSchema = z.object({
    password: z
        .string()

})

export default function AdminLayout({ children }) {

    const router = useRouter();
    const { isform, setFormData } = React.useContext(FormContext);
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // console.log(ADMIN_PASSWORD);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',

        },
    })


    function onSubmit(data) {
        // console.log(data);

        if (data.password !== ADMIN_PASSWORD) {
            toast.error("Invalid Admin Password");
            return;
        }

        setFormData(prev => ({
            ...prev,
            isAdmin: true
        }));
        router.push("/userInfo");
    }


    return (

        <div className="min-h-screen backdrop-blur-sm">
            {
                isform?.isAdmin === false && (

                    <div className="w-[90%] flex flex-col gap-6 max-w-md text-white mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-md backdrop-blur-sm">
                        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-password">
                                                Enter Admin Password
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-password"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter your admin password"
                                                autoComplete="off"
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

                )
            }



            {children}

        </div>
    )
}
