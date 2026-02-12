import { radioVariants, scrollbarDefault } from '@/components/html/css';
import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  type fieldVariants,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import {
  createFormHook,
  createFormHookContexts,
  type AnyFieldMeta,
  type FieldApi,
} from '@tanstack/react-form';
import type { VariantProps } from 'class-variance-authority';
import {
  ChevronRight,
  Eye,
  EyeOff,
  Funnel,
  LockKeyhole,
  Search,
  XIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { toastError } from '@/components/uix/toast';

export const Required = ({ required }: { required?: boolean }) => {
  return required ? <span className="text-red-400">*</span> : '';
};

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
// expect
export type Option = { readonly label: string; readonly value: string };
export type Options = readonly {
  readonly label?: string;
  readonly value: string;
}[];
export type FieldApiT<T> = FieldApi<
  any,
  string,
  T,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export const Form = ({
  className,
  children,
  onSubmit,
}: {
  className?: string;
  children: React.ReactNode;
  onSubmit?: () => void | Promise<void>;
}) => {
  return (
    <form
      className={className}
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await onSubmit?.();
        } catch (error) {
          toastError(error);
        }
      }}
    >
      {children}
    </form>
  );
};
// return a form.Subscribe.selector
const selector =
  ({
    isFirstStep = true,
    currentFields,
  }: {
    isFirstStep: boolean;
    currentFields: 'all' | readonly string[];
  }) =>
  (state: ReturnType<typeof useFormContext>['state']) => {
    let hasErrors = false;
    let isTouched = false;
    for (const field of currentFields) {
      const meta = (state.fieldMeta as Record<string, AnyFieldMeta>)[field];
      if (meta) {
        if (meta.errors.length > 0) hasErrors = true;
        if (meta.isTouched) isTouched = true;
      }
      // 早停：如果已确定 hasErrors 和 hasTouched，都 true 时停止
      if (hasErrors && isTouched) break;
    }
    return {
      canNext: !(hasErrors || (isFirstStep && !isTouched)),
      isTouched,
      isSubmitting: state.isSubmitting,
    };
  };

const NextButton = ({
  label = '下一步',
  isFirstStep = true,
  currentFields,
  handleNext,
}: {
  label?: string;
  isFirstStep: boolean;
  currentFields: readonly string[];
  handleNext: () => void | Promise<void>;
}) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={selector({ isFirstStep, currentFields })}>
      {({ canNext, isTouched }) =>
        (!isFirstStep || isTouched) && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleNext}
            disabled={!canNext}
          >
            {label}
            <ChevronRight />
          </Button>
        )
      }
    </form.Subscribe>
  );
};
const SubmitButton = ({
  label = '提交',
  className,
}: {
  label?: string;
  className?: string;
}) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => {
        return {
          canNext: state.errors.length === 0,
          isSubmitting: state.isSubmitting,
        };
      }}
    >
      {({ canNext, isSubmitting }) => (
        <Button
          type="submit"
          disabled={isSubmitting || !canNext}
          className={className}
        >
          {isSubmitting && <Spinner />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};
const FloatingSaveBar = ({
  view,
  isSubmitting,
  reset,
  isSubmitSuccessful,
}: {
  view: boolean;
  isSubmitting: boolean;
  reset: () => void;
  isSubmitSuccessful: boolean;
}) => {
  const TOAST_ID = 'floating-save-bar';
  useEffect(() => {
    console.log('FloatingSaveBar.useEffect:', view);
    if (view) {
      toast(
        <div className="flex justify-between items-center w-full">
          <span className="text-foreground">注意！您尚未保存更改！</span>
          <div className="flex items-center">
            <Button
              variant="link"
              onClick={() => {
                reset();
                // toast.dismiss(TOAST_ID)
              }}
            >
              重置
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}保存更改
            </Button>
          </div>
        </div>,
        {
          id: TOAST_ID,
          toasterId: 'form',
          classNames: {
            toast: 'py-2.5',
            content: cn('w-full'),
          },
        },
        // invert: false Dark toast in light mode and vice versa.
        // If 'false', it'll prevent the user from dismissing the toast.
      );
    } else {
      toast.dismiss(TOAST_ID);
    }
  }, [view, isSubmitting, reset]);
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      toast.dismiss(TOAST_ID);
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Toaster
      id="form"
      position="bottom-center"
      richColors
      duration={Infinity}
    />
  );
};
const FormFloatingSaveBar = ({
  watchedFields,
}: {
  watchedFields?: readonly string[];
}) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => {
        if (!watchedFields) {
          return {
            view:
              state.isDirty &&
              state.errors.length === 0 &&
              !state.isDefaultValue,
            isSubmitSuccessful: state.isSubmitSuccessful,
            isSubmitting: state.isSubmitting,
          };
        }
        let hasErrors = false;
        let isDirty = false;
        let isDefaultValue = true;
        // TODO: 注意检查是否存在逻辑错误
        for (const field of watchedFields) {
          const meta = (state.fieldMeta as Record<string, AnyFieldMeta>)[field];
          if (meta) {
            if (meta.errors.length > 0) hasErrors = true;
            if (meta.isDirty) isDirty = true;
            if (!meta.isDefaultValue) isDefaultValue = false;
          }

          if (!hasErrors && isDirty && !isDefaultValue) break;
        }
        return {
          view: isDirty && !hasErrors && !isDefaultValue,
          isSubmitSuccessful: state.isSubmitSuccessful,
          isSubmitting: state.isSubmitting,
        };
      }}
    >
      {({ view, isSubmitting, isSubmitSuccessful }) => (
        <FloatingSaveBar
          view={view}
          isSubmitting={isSubmitting}
          reset={form.reset}
          isSubmitSuccessful={isSubmitSuccessful}
        />
      )}
    </form.Subscribe>
  );
};
export const CheckboxItem = ({
  invalid = false,
  value,
  label,
  field,
  type = 'default',
}: {
  invalid?: boolean;
  value: string;
  label?: string;
  field: FieldApiT<string[] | undefined>;
  type?: 'default' | 'x' | 'only_read';
}) => {
  return (
    <FieldLabel
      htmlFor={`checkbox-${value}`}
      className={radioVariants({ size: 'sm', type })}
    >
      <Checkbox
        id={`checkbox-${value}`}
        name={field.name}
        aria-invalid={invalid}
        checked={field.state.value?.includes(value)}
        onCheckedChange={(checked) => {
          if (checked) {
            field.pushValue(value);
          } else if (field.state.value) {
            const index = field.state.value.indexOf(value);
            if (index > -1) {
              field.removeValue(index);
            }
          }
        }}
        className="sr-only"
      />
      {label || value}
      {type === 'x' && <XIcon size={16} strokeWidth={2.5} />}
    </FieldLabel>
  );
};
const FieldCheckbox = ({
  label,
  description,
}: {
  label?: React.ReactNode;
  description?: string;
}) => {
  const field = useFieldContext<boolean | undefined>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <Field data-invalid={invalid}>
      <div className="flex  gap-2 text-muted-foreground text-xs ">
        <Checkbox
          name={field.name}
          id={`checkbox-${field.name}`}
          aria-invalid={invalid}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked as boolean)}
        />
        <FieldContent>
          <FieldLabel className="text-xs" htmlFor={`checkbox-${field.name}`}>
            {label}
          </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
      </div>
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
const FieldCheck = ({ label }: { label: string }) => {
  const field = useFieldContext<boolean | undefined>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <FieldLabel className={radioVariants({ size: 'sm' })}>
      <Checkbox
        name={field.name}
        aria-invalid={invalid}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          if (checked) {
            field.handleChange(checked as boolean);
            return;
          }
          field.handleChange(undefined);
        }}
        className="sr-only"
      />
      {label}
    </FieldLabel>
  );
};
const FieldRadioGroup = <T extends Options>({
  title,
  required = true,
  options,
  variant = 'default',
  defaultValue,
  orientation = 'horizontal',
}: {
  title?: string;
  required?: boolean;
  options: T;
  variant?: 'default' | 'radio';
  defaultValue?: T[0]['value'];
} & VariantProps<typeof fieldVariants>) => {
  const field = useFieldContext<T[0]['value']>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <FieldSet>
      <FieldLegend>
        {title} <Required required={required} />
      </FieldLegend>
      <RadioGroup
        name={field.name}
        defaultValue={defaultValue}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value as T[0]['value'])}
        className="flex flex-row flex-wrap gap-2"
      >
        {options.map((item) => (
          <FieldLabel
            key={item.value}
            data-variant={variant}
            className={radioVariants({
              className: 'data-[variant=default]:flex-none',
            })}
          >
            <FieldContent
              data-variant={variant}
              className="data-[variant=default]:flex-none data-[variant=default]:w-fit"
            >
              <FieldTitle>{item.label || item.value}</FieldTitle>
            </FieldContent>
            <RadioGroupItem
              data-variant={variant}
              value={item.value}
              aria-invalid={invalid}
              className="data-[variant=default]:sr-only data-[variant=default]:hidden"
            />
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
};

const FieldCheckboxGroup = <T extends Options>({
  title,
  required = false,
  options,
}: {
  options: T;
  required?: boolean;
  title?: string;
}) => {
  const field = useFieldContext<string[] | undefined>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <FieldSet>
      <FieldLegend>
        {title} <Required required={required} />
      </FieldLegend>
      <FieldGroup className="flex-row flex-wrap gap-2 border p-3 rounded-xl ">
        {options.map((i) => (
          <CheckboxItem
            key={i.value}
            invalid={invalid}
            value={i.value}
            label={i.label || i.value}
            field={field}
          />
        ))}
      </FieldGroup>
    </FieldSet>
  );
};
const FieldInput = ({
  title,
  description,
  required = false,
}: {
  title?: string;
  description?: string;
  required?: boolean;
}) => {
  const field = useFieldContext<string>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <Field data-invalid={invalid}>
      <FormFieldTitle title={title} required={required} />
      <Input
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={invalid}
        placeholder=""
        autoComplete="off"
        disabled={false}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
const FieldInputGroup = ({
  title,
  description,
  required = false,
  placeholder,
  Addon,
  AddonInlineEnd,
}: {
  title?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  Addon?: React.ReactNode;
  AddonInlineEnd?: React.ReactNode;
}) => {
  const field = useFieldContext<string>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <Field data-invalid={invalid}>
      <FormFieldTitle title={title} required={required} />
      <InputGroup>
        <InputGroupInput
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={invalid}
          placeholder={placeholder}
          autoComplete="off"
          disabled={false}
        />
        {Addon && <InputGroupAddon>{Addon}</InputGroupAddon>}
        {AddonInlineEnd && (
          <InputGroupAddon align="inline-end">{AddonInlineEnd}</InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
const TextareaField = ({
  title,
  placeholder,
}: {
  title?: string;
  placeholder?: string;
}) => {
  const field = useFieldContext<string>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel>{title}</FieldLabel>
      <Textarea
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={invalid}
        placeholder={placeholder}
        className="min-h-30"
      />
      <FieldDescription></FieldDescription>
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
const InputPassword = ({
  title,
  placeholder = '请输入密码',
  description,
  required = true,
}: {
  title?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}) => {
  const field = useFieldContext<string>();
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Field data-invalid={invalid}>
      <FormFieldTitle title={title} required={required} />
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          type={isVisible ? 'text' : 'password'}
        />
        <InputGroupAddon>
          <LockKeyhole />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <button
            aria-label="toggle password visibility"
            className="focus:outline-hidden mr-1"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const FieldSearch = ({ className }: { className?: string }) => {
  const field = useFieldContext<string>();
  return (
    <InputGroup className={`w-fit ${className}`}>
      <InputGroupInput
        placeholder="搜索..."
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export const FormFieldTitle = ({
  title,
  required,
}: {
  title?: string;
  required: boolean;
}) =>
  title ? (
    <FieldLabel>
      {title} <Required required={required} />
    </FieldLabel>
  ) : null;

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    FieldCheckbox,
    FieldInput,
    FieldInputGroup,
    InputPassword,
    TextareaField,
    FieldRadioGroup,
    CheckboxItem,
    FieldCheckboxGroup,
    FieldCheck,
    CheckboxGroup: ({
      title,
      required = false,
      options = [],
    }: {
      title: string;
      required?: boolean;
      options: Options;
    }) => {
      const field = useFieldContext<string[] | undefined>();
      const invalid = !field.state.meta.isValid && field.state.meta.isTouched;
      return (
        <FieldSet>
          <FieldLegend>
            {title} <Required required={required} />
          </FieldLegend>
          <FieldGroup className="flex-row flex-wrap gap-2">
            {options.map((item) => (
              <CheckboxItem
                key={item.value}
                invalid={invalid}
                value={item.value}
                label={item.label}
                field={field}
              />
            ))}
          </FieldGroup>
        </FieldSet>
      );
    },

    FieldSearch,
  },
  formComponents: {
    NextButton,
    SubmitButton,
    Form,
    FormFloatingSaveBar,
  },
});
export const FileItem = ({
  children,
  file,
}: {
  children?: React.ReactNode;
  file: File;
}) => {
  return (
    <Item variant="muted" size="sm">
      <ItemContent>
        <ItemTitle>{file.name}</ItemTitle>
      </ItemContent>
      <ItemActions>{children}</ItemActions>
    </Item>
  );
};
