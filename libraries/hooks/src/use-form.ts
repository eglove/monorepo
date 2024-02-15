import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { useState } from 'react';
import type { z } from 'zod';
import { ZodError } from 'zod';

export type FieldErrors<StateType> =
  | Record<keyof StateType, string[] | undefined | null>
  | undefined;

export type UseFormProperties<StateType> = {
  onChange?: (event: ChangeEvent) => unknown;
  onError?: (error: unknown) => unknown;
  onFieldError?: (error: FieldErrors<StateType>) => unknown;
  onSubmit?: (...arguments_: unknown[]) => unknown;
  zodValidator?: z.ZodTypeAny;
};

export type UseFormReturn<StateType> = {
  clearFieldErrors: () => void;
  clearForm: () => void;
  fieldErrors: FieldErrors<StateType>;
  formError: string | undefined;
  formState: StateType;
  handleChange: (event: ChangeEvent) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors<StateType>>>;
  setFormError: Dispatch<SetStateAction<string | undefined>>;
  setFormState: Dispatch<SetStateAction<StateType>>;
  setValue: (key: keyof StateType, value: StateType[typeof key]) => void;
};

const setAll = <ObjectType extends Record<string, unknown>, ValueType>(
  object: ObjectType,
  value?: ValueType,
): ObjectType => {
  const fromEntries = Object.fromEntries(
    Object.entries(object).map(([key]) => {
      return [key, value];
    }),
  );

  return fromEntries as unknown as ObjectType;
};

const getZodFieldErrors = (
  error: unknown,
  errorMap: Record<string, unknown>,
): Record<string, string[]> => {
  let errors: Record<string, string[]> = {};

  if (error instanceof ZodError) {
    for (const key of Object.keys(errorMap)) {
      const errorArray = error.formErrors.fieldErrors[key];

      if (errorArray !== undefined) {
        errors = {
          ...errors,
          [key]: errorArray,
        };
      }
    }
  }

  return errors;
};

export const useForm = <StateType extends Record<string, unknown>>(
  initialState: StateType,
  properties?: UseFormProperties<StateType>,
): UseFormReturn<StateType> => {
  const [formState, setFormState] = useState(() => {
    const defaultState: Record<string, unknown> = {};
    for (const key of Object.keys(initialState)) {
      defaultState[key] =
        initialState[key] === undefined ? '' : initialState[key];
    }

    return defaultState as StateType;
  });
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<StateType>>();

  const clearFieldErrors = (): void => {
    if (fieldErrors !== undefined) {
      setFieldErrors(setAll(fieldErrors, null));
    }
  };

  const clearForm = (): void => {
    setFormState(setAll(formState, ''));
  };

  const resetForm = (): void => {
    setFormState(initialState);
  };

  const handleChange = (event: ChangeEvent): void => {
    const eventTarget = event.target as unknown as {
      checked?: boolean;
      files: File[];
      name: string;
      type: string;
      value: string | boolean | number | File;
    };

    let { value } = eventTarget;
    const { checked, name, type, files } = eventTarget;

    if (type === 'checkbox' && checked !== undefined) {
      value = checked;
    }

    if (type === 'number' && typeof value === 'string') {
      value = Number.parseFloat(value.replaceAll(',', ''));
    }

    if (type === 'file') {
      [value] = files;
    }

    setFormState(formState_ => {
      return {
        ...formState_,
        [name]: value,
      };
    });

    properties?.onChange?.(event);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();

    try {
      properties?.zodValidator?.parse(formState);
    } catch (error: unknown) {
      const errors = getZodFieldErrors(error, formState) as typeof fieldErrors;
      setFieldErrors(errors);
      properties?.onFieldError?.(errors);
      return;
    }

    if (properties?.onSubmit === undefined) {
      return;
    }

    let hasException = false;
    try {
      properties.onSubmit();
    } catch (error: unknown) {
      hasException = true;
      properties.onError?.(error);

      if (error instanceof Error) {
        setFormError(error.message);
      }
    }

    if (!hasException) {
      clearFieldErrors();
      setFormError('');
    }
  };

  const setValue = (key: keyof StateType, value: StateType[typeof key]) => {
    setFormState(previousState => {
      return {
        ...previousState,
        [key]: value,
      };
    });
  };

  return {
    clearFieldErrors,
    clearForm,
    fieldErrors,
    formError,
    formState,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldErrors,
    setFormError,
    setFormState,
    setValue,
  };
};
