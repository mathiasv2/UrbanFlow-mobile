import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useForm } from "react-hook-form";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Screen from "../../components/Screen";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../utils/types/StackParamList/authStackParamList";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;
interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const EMAIL_RULE = {
  required: "L'email est requis",
  pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" },
};

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setSubmitError(null);
    setLoading(true);
    try {
      await register(data);
    } catch (e) {
      setSubmitError((e as Error).message || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <Text className="mb-1 font-sans-bold text-2xl text-ink dark:text-ink-dark">
            Créer un compte
          </Text>
          <Text className="mb-8 font-sans text-ink-muted dark:text-ink-dark-muted">
            Rejoignez le réseau en quelques secondes
          </Text>

          <TextField<RegisterForm>
            control={control}
            name="name"
            label="Nom complet"
            placeholder="Alice Dupont"
            autoCapitalize="words"
            rules={{ required: "Le nom est requis" }}
            error={errors.name}
          />
          <TextField<RegisterForm>
            control={control}
            name="email"
            label="Email"
            placeholder="vous@mail.com"
            keyboardType="email-address"
            rules={EMAIL_RULE}
            error={errors.email}
          />
          <TextField<RegisterForm>
            control={control}
            name="password"
            label="Mot de passe"
            placeholder="6 caractères minimum"
            secureTextEntry
            rules={{
              required: "Le mot de passe est requis",
              minLength: { value: 6, message: "6 caractères minimum" },
            }}
            error={errors.password}
          />

          {submitError ? (
            <Text className="mb-3 text-center font-sans text-sm text-error">
              {submitError}
            </Text>
          ) : null}

          <Button
            title="Créer mon compte"
            icon="account-plus"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          />

          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-6 flex-row justify-center"
          >
            <Text className="font-sans text-ink-muted dark:text-ink-dark-muted">
              Déjà inscrit ?{" "}
            </Text>
            <Text className="font-sans-semibold text-primary">Se connecter</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
