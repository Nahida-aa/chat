"use client";

import { userUpdateZ, type UserUpdate } from "../../user/schema/index.t";
import { LinkButton } from "../../../app/a/ui/base/button";
import { FileSelectButton } from "../../../app/a/ui/form/input";
import { Description, Label } from "../../../app/a/ui/label";
import { toast } from "../../../app/a/ui/toast";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  ChevronRightIcon,
  Hash,
  Smartphone,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import z, { email } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/features/user/action";
import { useUser } from "@/lib/client/swr.c";
import { SaveButton } from "@/app/a/ui/form/Button";
import { Button } from "@/components/uix/html";
import { useModal } from "@/app/a/ui/modal/modal.provider";
import { CreateProjectForm } from "@/app/(main)/@chat/_comp/CreateProjectForm";
import { FormField, Input } from "@/app/a/ui/form/FormField";
import { username } from "better-auth/plugins";
import {
  maskPhone,
  OTPSchema,
  phoneSchema,
  usernameSchema,
} from "@/features/auth/type";
import type { AuthUser } from "@/features/auth/auth";
import { authClient } from "@/features/auth/client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import InputPhoneNumber from "@/app/(main)/@modal/_comp/InputPhoneNumber";
import { useCountdown } from "usehooks-ts";
import { stringIsNumber, stringToNumber } from "@/lib/utils/toType";
import { useTranslations } from "next-intl";

export default function SetPhoneNumberForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const t = useTranslations();
  const formSchema = z.object({
    phoneNumber: phoneSchema,
    code: OTPSchema,
  });
  type Data = z.infer<typeof formSchema>;
  const form = useForm<Data>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { phoneNumber: "" },
  });

  // useCountdown 配置：初始 60s，成功发送后启动
  const [sending, setSending] = useState(false);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: 1000,
    });
  useEffect(() => {
    if (count === 0) setSending(false);
  }, [count]);
  const onSendPhoneOtp = async () => {
    if (sending) return; // 避免重复发送
    const isValid = await form.trigger("phoneNumber");
    if (!isValid) {
      // 可选: toast 错误或聚焦字段
      form.setFocus("phoneNumber");
      // toast.error("手机号格式无效");
      return;
    }
    resetCountdown();
    setSending(true);

    const { data, error } = await authClient.phoneNumber.sendOtp(
      {
        phoneNumber: `+86${form.getValues("phoneNumber")}`,
      },
      {
        onRequest(context) {
          startCountdown();
        },
        onResponse(context) {},
        onError(context) {
          context.response.headers.get("X-Retry-After"); // 单位 s
          const retryAfter = context.response.headers.get("X-Retry-After");
          console.log(context.error);
          context.error.message =
            retryAfter && !Number.isNaN(Number(retryAfter))
              ? t("429withTime", { time: retryAfter })
              : t("429");
          toast.error(context.error);
          setSending(false);
        },
      },
    );
    if (error) return;
  };

  const onSubmit = async (fd: Data) => {
    const { error } = await authClient.phoneNumber.verify({
      phoneNumber: `+86${fd.phoneNumber}`,
      code: fd.code,
      updatePhoneNumber: true, // Set to true to update the phone number
    });
    if (error) {
      // if (error?.code === "PHONE_NUMBER_ALREADY_EXISTS") {
      //   error.message = "手机号已被其他用户绑定"
      // }
      return toast.error(error, "修改失败");
    }
    toast.success("修改成功");
    // mutateSession();
    onSuccess?.();
  };
  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field, fieldState: { invalid } }) => (
          <InputPhoneNumber {...field} invalid={invalid} />
        )}
      />
      <FormField
        name="code"
        control={form.control}
        description="5分钟内有效, 60秒可重新发送"
        render={({ field, fieldState }) => (
          <div className="flex gap-2">
            <InputGroup>
              <InputGroupInput
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="请输入验证码"
              />
              <InputGroupAddon>
                <Hash />
              </InputGroupAddon>
            </InputGroup>
            <Button
              className="w-25"
              type="button"
              variant="secondary"
              disabled={sending}
              onClick={() => onSendPhoneOtp()}
            >
              {sending ? `${count} 秒后重发` : "发送验证码"}
            </Button>
          </div>
        )}
      />
      <Field orientation="horizontal" className="justify-end">
        <SaveButton
          pending={form.formState.isLoading}
          disabled={!form.formState.isDirty || !form.formState.isValid}
        />
      </Field>
    </form>
  );
}
