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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../utils/types/StackParamList/authStackParamList";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;
interface LoginForm {
  email: string;
  password: string;
}

const EMAIL_RULE = {
  required: "L'email est requis",
  pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" },
};

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "alice@mail.com", password: "password123" },
  });

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null);
    setLoading(true);
    try {
      await signIn(data);
    } catch (e) {
      setSubmitError((e as Error).message || "Connexion impossible");
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
          <View className="mb-8 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <MaterialCommunityIcons name="train-car" size={32} color="#fff" />
            </View>
            <Text className="font-sans-bold text-2xl text-ink dark:text-ink-dark">
              Transport en Commun
            </Text>
            <Text className="mt-1 font-sans text-ink-muted dark:text-ink-dark-muted">
              Connectez-vous pour continuer
            </Text>
          </View>

          <TextField<LoginForm>
            control={control}
            name="email"
            label="Email"
            placeholder="vous@mail.com"
            keyboardType="email-address"
            rules={EMAIL_RULE}
            error={errors.email}
          />
          <TextField<LoginForm>
            control={control}
            name="password"
            label="Mot de passe"
            placeholder="••••••••"
            secureTextEntry
            rules={{ required: "Le mot de passe est requis" }}
            error={errors.password}
          />

          {submitError ? (
            <Text className="mb-3 text-center font-sans text-sm text-error">
              {submitError}
            </Text>
          ) : null}

          <Button
            title="Se connecter"
            icon="login"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          />

          <Pressable
            onPress={() => navigation.navigate("Register")}
            className="mt-6 flex-row justify-center"
          >
            <Text className="font-sans text-ink-muted dark:text-ink-dark-muted">
              Pas encore de compte ?{" "}
            </Text>
            <Text className="font-sans-semibold text-primary">Créer un compte</Text>
          </Pressable>

          <Text className="mt-8 text-center font-sans text-xs text-ink-placeholder">
            Comptes de test : alice@mail.com / password123 · bob@mail.com /
            secret456
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
