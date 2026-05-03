'use client';

import {
    createFormHookContexts,
    createFormHook,
} from '@tanstack/react-form';

export const {
    fieldContext,
    formContext,
    useFormContext,
    useFieldContext
} = createFormHookContexts();

export const {
    useAppForm,
    useTypedAppFormContext
} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {},
    formComponents: {}
});