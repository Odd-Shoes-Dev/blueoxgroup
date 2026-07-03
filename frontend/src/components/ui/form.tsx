"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"

/**
 * Root provider — re-exports RHF's FormProvider so consumers write:
 *   <Form {...form}> ... </Form>
 * exactly like the Radix-based shadcn/ui convention. This is *not* base-ui's
 * <Form> element — react-hook-form drives values/validation, base-ui/react's
 * Field.Root only renders structure + a11y wiring around each control, so
 * there's no native <form> element assumption baked in here (the consumer's
 * <form onSubmit={form.handleSubmit(onSubmit)}> provides that).
 */
const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
)

/**
 * Wires an RHF Controller to a given field name and exposes that name via
 * context so FormItem's descendants (FormLabel, FormControl, FormMessage...)
 * can look up the corresponding field state without prop-drilling.
 */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * Establishes base-ui's Field.Root for this item. Field-aware base-ui
 * components (Input, Select.Root, Checkbox.Root, Field.Control, ...) read
 * FieldRootContext automatically — e.g. `@base-ui/react/input`'s <Input> is
 * literally `Field.Control` under the hood — so nesting them anywhere below
 * FormItem wires up id/name/aria-invalid/aria-describedby/disabled for free.
 * We still drive `invalid`/`name` explicitly off RHF's field state since RHF
 * (via the zod resolver) owns validation, not base-ui's own
 * `validate`/`validationMode` machinery on Field.Root.
 *
 * Note: this reads FormFieldContext (set by the enclosing <FormField>)
 * directly rather than via useFormField(), since useFormField() depends on
 * FormItemContext, which this component is the one providing.
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })
  const { error } = fieldContext
    ? getFieldState(fieldContext.name, formState)
    : { error: undefined }

  return (
    <FormItemContext.Provider value={{ id }}>
      <FieldPrimitive.Root
        name={fieldContext?.name}
        invalid={!!error}
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  const { error, formItemId } = useFormField()

  return (
    <FieldPrimitive.Label
      data-slot="form-label"
      data-error={!!error}
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none data-[error=true]:text-destructive",
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
}

/**
 * Merges id/aria-describedby/aria-invalid onto the single child element via
 * base-ui's `render` prop — the base-ui equivalent of Radix's
 * asChild/Slot (base-ui ships no generic Slot primitive; `render` accepting
 * a ReactElement directly IS the composition mechanism, same pattern used
 * for the icon slot in select.tsx). The child is expected to be a single
 * field-aware base-ui control (Input, Select.Trigger, Checkbox, Textarea...).
 */
function FormControl({ children }: { children: React.ReactElement }) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField()

  return (
    <FieldPrimitive.Control
      render={children}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
