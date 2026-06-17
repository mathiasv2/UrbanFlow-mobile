import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import LineBadge from "../../components/LineBadge";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { usersApi } from "../../api/users";
import { Favorite } from "../../utils/types/User/favorite";

interface ProfileForm {
  name: string;
  email: string;
}


export default function ProfileScreen() {
  const { user, token, updateProfile, signOut } = useAuth();
  const { mode, isDark, setThemeMode } = useTheme();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const loadFavorites = useCallback(async () => {
    if (!token) return;
    try {
      const { favorites: favs } = await usersApi.favorites(token);
      setFavorites(favs || []);
    } catch {
    }
  }, [token]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const startEdit = () => {
    reset({ name: user?.name || "", email: user?.email || "" });
    setSaveError(null);
    setEditing(true);
  };

  const onSave = async (data: ProfileForm) => {
    setSaveError(null);
    setSaving(true);
    try {
      await updateProfile({ name: data.name, email: data.email });
      setEditing(false);
    } catch (e) {
      setSaveError((e as Error).message || "Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: signOut },
    ]);
  };

  const removeFavorite = async (favId: number) => {
    if (!token) return;
    try {
      await usersApi.removeFavorite(favId, token);
      setFavorites((prev) => prev.filter((f) => f.id !== favId));
    } catch (e) {
      Alert.alert("Favori", (e as Error).message || "Suppression impossible");
    }
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((p: any[]) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Screen>
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card className="mb-4 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Text className="font-sans-bold text-2xl text-white">{initials}</Text>
          </View>
          <Text className="mt-3 font-sans-bold text-xl text-ink dark:text-ink-dark">
            {user?.name}
          </Text>
          <Text className="font-sans text-sm text-ink-muted dark:text-ink-dark-muted">
            {user?.email}
          </Text>
        </Card>

        <Card className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-sans-semibold text-base text-ink dark:text-ink-dark">
              Informations personnelles
            </Text>
            {!editing ? (
              <Pressable onPress={startEdit} className="flex-row items-center">
                <MaterialCommunityIcons name="pencil-outline" size={16} color="#6912E2" />
                <Text className="ml-1 font-sans-semibold text-sm text-primary">Modifier</Text>
              </Pressable>
            ) : null}
          </View>

          {editing ? (
            <>
              <TextField<ProfileForm>
                control={control}
                name="name"
                label="Nom complet"
                autoCapitalize="words"
                rules={{ required: "Le nom est requis" }}
                error={errors.name}
              />
              <TextField<ProfileForm>
                control={control}
                name="email"
                label="Email"
                keyboardType="email-address"
                rules={{
                  required: "L'email est requis",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" },
                }}
                error={errors.email}
              />
              {saveError ? (
                <Text className="mb-2 font-sans text-sm text-error">{saveError}</Text>
              ) : null}
              <View className="flex-row">
                <Button title="Annuler" variant="secondary" onPress={() => setEditing(false)} className="mr-2 flex-1" />
                <Button title="Enregistrer" loading={saving} onPress={handleSubmit(onSave)} className="flex-1" />
              </View>
            </>
          ) : (
            <View>
              <InfoLine label="Nom" value={user?.name} />
              <InfoLine label="Email" value={user?.email} />
            </View>
          )}
        </Card>

        <Card className="mb-4">
          <Text className="mb-2 font-sans-semibold text-base text-ink dark:text-ink-dark">
            Mes favoris
          </Text>
          {favorites.length === 0 ? (
            <Text className="py-2 font-sans text-sm text-ink-placeholder">
              Aucun favori. Ajoutez un arrêt depuis sa fiche ❤.
            </Text>
          ) : (
            favorites.map((f) => (
              <View key={`${f.type}-${f.id}`} className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name={f.type === "stop" ? "bus-stop" : "transit-connection-variant"}
                    size={18}
                    color="#AEAEB2"
                  />
                  <View className="ml-2">
                    {f.type === "line" ? (
                      <LineBadge name={f.label} color={f.color || "#6E6E73"} size="sm" />
                    ) : (
                      <Text className="font-sans text-base text-ink dark:text-ink-dark">{f.label}</Text>
                    )}
                  </View>
                </View>
                <Pressable onPress={() => removeFavorite(f.id)} hitSlop={8}>
                  <MaterialCommunityIcons name="close" size={18} color="#AEAEB2" />
                </Pressable>
              </View>
            ))
          )}
        </Card>

        <Card className="mb-4">
          <Text className="mb-3 font-sans-semibold text-base text-ink dark:text-ink-dark">
            Apparence
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name={isDark ? "weather-night" : "white-balance-sunny"}
                size={20}
                color="#6912E2"
              />
              <Text className="ml-3 font-sans text-base text-ink dark:text-ink-dark">
                Mode sombre
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => setThemeMode(v ? "dark" : "light")}
              trackColor={{ true: "#6912E2" }}
            />
          </View>
          <Pressable onPress={() => setThemeMode("system")} className="mt-3 flex-row items-center">
            <MaterialCommunityIcons
              name={mode === "system" ? "radiobox-marked" : "radiobox-blank"}
              size={18}
              color="#AEAEB2"
            />
            <Text className="ml-2 font-sans text-sm text-ink-muted dark:text-ink-dark-muted">
              Suivre le système
            </Text>
          </Pressable>
        </Card>

        <Button title="Se déconnecter" variant="danger" icon="logout" onPress={confirmLogout} />
      </ScrollView>
    </Screen>
  );
}

function InfoLine({ label, value }: { label: string; value?: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="font-sans text-sm text-ink-muted dark:text-ink-dark-muted">{label}</Text>
      <Text className="font-sans-semibold text-sm text-ink dark:text-ink-dark">{value || "—"}</Text>
    </View>
  );
}
