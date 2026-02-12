// "use client";

// import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
// import { ChevronRightIcon, TrashIcon, UserIcon } from "lucide-react";
// import { useCallback, useState, type FormEvent } from "react";
// import { Controller, useForm } from "react-hook-form";
// import z, { email } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { updateUser } from "@/features/user/action";
// import { useUser } from "@/lib/client/swr.c";
// import { SaveButton } from "@/app/a/ui/form/Button";
// import { Button } from "@/components/uix/html";
// import { useModal } from "@/app/a/ui/modal/modal.provider";
// import { CreateProjectForm } from "@/app/(main)/@chat/_comp/CreateProjectForm";
// import { FormField, Input } from "@/app/a/ui/form/FormField";
// import { username } from "better-auth/plugins";
// import { maskPhone, usernameSchema } from "@/features/auth/type";
// import type { AuthUser } from "@/features/auth/auth";
// import { authClient } from "@/features/auth/client";
// import { toast } from "@/app/a/ui/toast";
// import { useDebounceCallback } from "usehooks-ts";

// export default function SetUsernameForm({
//   onSuccess,
//   user,
// }: {
//   onSuccess?: () => void;
//   user: AuthUser;
// }) {
//   // const { session, mutateSession } = useSession();
//   // const { user, mutateUser } = useUser(session!.user.id);
//   const formSchema = z.object({
//     username: usernameSchema,
//   });
//   type Data = z.infer<typeof formSchema>;
//   const { handleSubmit, control, formState, setError, getValues, setValue } =
//     useForm<Data>({
//       resolver: zodResolver(formSchema),
//       mode: "onChange",
//       defaultValues: { username: user.username },
//     });

//   const checkUsernameAvailability = async (username: string) => {
//     // 先通过基础验证
//     const basicValidation = formSchema.shape.username.safeParse(username);
//     if (!basicValidation.success) {
//       // setUsernameValidation("idle");
//       return;
//     }

//     // setUsernameValidation("checking");
//     // setUsernameError(null);
//     const { data, error } = await authClient.isUsernameAvailable({
//       username,
//     });

//     if (error || !data) {
//       // setUsernameValidation("idle");
//       // setUsernameError("检查失败，请稍后重试");
//       return;
//     }
//     if (data.available) {
//       // setUsernameValidation("available");
//       // setUsernameError(null);
//     } else {
//       // setUsernameValidation("taken");
//       // setUsernameError(data.message || "用户名已被占用");
//       setError("username", {
//         type: "manual",
//         message: "用户名已被占用",
//       });
//     }
//   };
//   const debounced = useDebounceCallback(checkUsernameAvailability, 500);
//   const handleUsernameChange = (value: string) => {
//     if (value !== user.username) {
//       debounced(value);
//     }
//   };
//   const onSubmit = async (data: Data) => {
//     try {
//       await updateUser(data);
//       toast.success("修改成功");
//       // mutateSession();
//       onSuccess?.();
//     } catch (error) {
//       toast.error(error, "修改失败");
//     }
//   };
//   return (
//     <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
//       <FormField
//         control={control}
//         name="username"
//         description="您的唯一标识符，请谨慎修改"
//         render={({ field, fieldState: { invalid, error } }) => (
//           <Input
//             {...field}
//             onChange={(e) => {
//               field.onChange(e);
//               handleUsernameChange(e.target.value);
//             }}
//             invalid={invalid}
//           />
//         )}
//       />
//       <Field orientation="horizontal" className="justify-end">
//         <SaveButton
//           pending={formState.isLoading}
//           disabled={!formState.isDirty || !formState.isValid}
//         />
//       </Field>
//     </form>
//   );
// }
