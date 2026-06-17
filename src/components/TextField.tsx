import React from "react";
import { View, Text, TextInput, type KeyboardTypeOptions } from "react-native";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";


interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: FieldError;
}

export default function TextField<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
}: TextFieldProps<T>) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="mb-1.5 font-sans-medium text-sm text-ink-muted dark:text-ink-dark-muted">
          {label}
        </Text>
      ) : null}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#AEAEB2"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            className={`rounded-xl border bg-card px-4 py-3.5 font-sans text-base text-ink dark:bg-card-dark dark:text-ink-dark ${
              error
                ? "border-error"
                : "border-border dark:border-border-dark"
            }`}
          />
        )}
      />
      {error ? (
        <Text className="mt-1 font-sans text-xs text-error">
          {error.message}
        </Text>
      ) : null}
    </View>
  );
}
