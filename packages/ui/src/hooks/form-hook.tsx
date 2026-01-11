import { fieldContext, formContext } from "@printy-mobile/ui/components/tanstack-form"
import { createFormHook } from "@tanstack/react-form"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})