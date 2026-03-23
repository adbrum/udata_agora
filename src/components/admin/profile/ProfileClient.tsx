"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  fetchFullProfile,
  fetchUserActivity,
  fetchCsrfToken,
  updateProfile,
  uploadAvatar,
  generateApiKey,
  clearApiKey,
  requestEmailChange,
} from "@/services/api";
import { Activity, UserPublic } from "@/types/api";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Avatar,
  Breadcrumb,
  Button,
  Icon,
  InputText,
  InputTextArea,
  ButtonUploader,
  StatusCard,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  usePopupContext,
} from "@ama-pt/agora-design-system";
import { ChangePasswordPopupContent } from "@/components/admin/profile/ChangePasswordPopupContent";

export default function ProfileClient() {
  const router = useRouter();
  const { show } = usePopupContext();
  const { displayName } = useCurrentUser();
  const { user, samlLogin, refresh } = useAuth();

  const [profile, setProfile] = useState<UserPublic | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const activityPageSize = 20;

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchFullProfile();
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setAbout(data.about || "");
        setWebsite(data.website || "");
        setApiKey(data.apikey || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    async function loadActivities() {
      if (!user?.id) return;
      setIsLoadingActivities(true);
      try {
        const response = await fetchUserActivity(user.id, activityPage, activityPageSize);
        setActivities(response.data || []);
        setActivityTotal(response.total || 0);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setIsLoadingActivities(false);
      }
    }
    loadActivities();
  }, [user?.id, activityPage]);

  const totalActivityPages = Math.ceil(activityTotal / activityPageSize);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      const updated = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        about,
        website,
      });
      setProfile(updated);
      setSaveSuccess(true);
      await refresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError("Erro ao guardar o perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true);
    try {
      const newKey = await generateApiKey();
      setApiKey(newKey);
    } catch (error) {
      console.error("Error generating API key:", error);
      setSaveError("Erro ao gerar a chave de API. Tente novamente.");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      await uploadAvatar(files[0]);
      const updated = await fetchFullProfile();
      setProfile(updated);
      await refresh();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setSaveError("Erro ao carregar a foto de perfil. Tente novamente.");
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail || newEmail === email) return;
    setIsChangingEmail(true);
    setSaveError("");
    setEmailChangeSuccess(false);
    try {
      const csrfToken = await fetchCsrfToken();
      await requestEmailChange(newEmail, csrfToken);
      setEmailChangeSuccess(true);
      setIsEditingEmail(false);
      setNewEmail("");
    } catch (error) {
      console.error("Error requesting email change:", error);
      setSaveError(
        "Erro ao solicitar a alteração de e-mail. Verifique o endereço e tente novamente."
      );
    } finally {
      setIsChangingEmail(false);
    }
  };

  const groupActivitiesByMonth = (acts: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    acts.forEach((act) => {
      const key = format(new Date(act.created_at), "MMMM 'de' yyyy", { locale: pt });
      if (!groups[key]) groups[key] = [];
      groups[key].push(act);
    });
    return groups;
  };

  const lastModified = profile?.since
    ? format(new Date(profile.since), "d 'de' MMMM 'de' yyyy", { locale: pt })
    : "";

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "Perfil", url: "/pages/admin/profile" },
          ]}
        />
      </div>

      <h1 className="admin-page__title mt-[64px] mb-[32px]">Perfil</h1>

      <div className="profile-card">
        <Avatar
          avatarType={profile?.avatar_thumbnail ? "image" : "initials"}
          srcPath={
            (profile?.avatar_thumbnail ||
              `${(profile?.first_name || "")[0] || ""}${(profile?.last_name || "")[0] || ""}`.toUpperCase()) as unknown as undefined
          }
          alt={`${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`}
          className="profile-card__avatar"
        />

        <div className="profile-card__body">
          <div className="profile-card__info">
            {profile?.organizations?.[0] && (
              <p className="text-neutral-900 text-base font-light leading-7">
                {profile.organizations[0].name}
              </p>
            )}
            <p className="text-neutral-900 text-xl font-semibold leading-8">
              {profile ? `${profile.first_name} ${profile.last_name}` : "..."}
            </p>
            {lastModified && (
              <p className="text-neutral-900 text-base leading-7">
                <span className="font-semibold">Membro desde:</span> {lastModified}
              </p>
            )}
          </div>

          <div className="absolute top-[32px] right-[32px]">
            <Button
              variant="primary"
              hasIcon
              leadingIcon="agora-line-eye"
              leadingIconHover="agora-solid-eye"
              onClick={() => router.push(`/pages/users/${user?.slug || ""}`)}
            >
              Ver perfil público
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-[32px]">
        <Tabs>
          <Tab active>
            <TabHeader>Perfil</TabHeader>
            <TabBody>
              <div
                className="admin-page__form mt-[24px]"
                style={{
                  maxWidth:
                    "calc(100% - var(--admin-auxiliar-width) - var(--admin-auxiliar-gap))",
                }}
              >
                <h2 className="admin-page__section-title">EDITAR PERFIL</h2>

                {saveSuccess && (
                  <StatusCard
                    type="success"
                    description="Perfil guardado com sucesso."
                  />
                )}
                {saveError && (
                  <StatusCard type="danger" description={saveError} />
                )}

                <div className="admin-page__fields-group">
                  <div className="flex gap-[18px]">
                    <div className="flex-1">
                      <InputText
                        label="Nome *"
                        placeholder="Insira o nome aqui"
                        id="first-name"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFirstName(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <InputText
                        label="Último nome *"
                        placeholder="Insira o apelido aqui"
                        id="last-name"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLastName(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <InputTextArea
                    label="Biografia"
                    placeholder="Insira a descrição aqui"
                    id="biography"
                    rows={4}
                    value={about}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setAbout(e.target.value)
                    }
                  />

                  <InputText
                    label="Site da Internet"
                    placeholder="Insira o URL aqui"
                    id="website"
                    value={website}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setWebsite(e.target.value)
                    }
                  />

                  <div>
                    <span className="text-primary-900 text-base font-medium leading-7">
                      Foto de perfil
                    </span>
                    <div className="mt-2">
                      <ButtonUploader
                        label="Ficheiros"
                        inputLabel="Selecione ou arraste o ficheiro"
                        removeFileButtonLabel="Remover ficheiro"
                        replaceFileButtonLabel="Substituir ficheiro"
                        extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                        accept=".jpg,.jpeg,.png"
                        maxSize={4194304}
                        maxCount={1}
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-[16px]">
                    <div className="flex-1">
                      <InputText
                        label="Chave de API"
                        placeholder="Nenhuma chave gerada"
                        id="api-key"
                        value={apiKey}
                        readOnly
                      />
                    </div>
                    <Button
                      appearance="outline"
                      variant="primary"
                      hasIcon
                      leadingIcon="agora-line-edit"
                      leadingIconHover="agora-solid-edit"
                      onClick={handleGenerateApiKey}
                      disabled={isGeneratingKey}
                    >
                      {isGeneratingKey ? "A gerar..." : "Gerar"}
                    </Button>
                  </div>

                  {emailChangeSuccess && (
                    <StatusCard
                      type="success"
                      description="Foi enviado um e-mail de confirmação para o novo endereço. Verifique a sua caixa de entrada."
                    />
                  )}

                  <div className="flex items-end gap-[16px]">
                    <div className="flex-1">
                      {isEditingEmail ? (
                        <InputText
                          label="Novo endereço de e-mail"
                          placeholder="Insira o novo e-mail aqui"
                          id="new-email"
                          value={newEmail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewEmail(e.target.value)
                          }
                        />
                      ) : (
                        <InputText
                          label="Endereço de e-mail"
                          placeholder="Insira o e-mail aqui"
                          id="email"
                          value={email}
                          readOnly
                        />
                      )}
                    </div>
                    {!samlLogin && (
                      <>
                        {isEditingEmail ? (
                          <div className="flex gap-[8px]">
                            <Button
                              appearance="outline"
                              variant="primary"
                              onClick={handleEmailChange}
                              disabled={isChangingEmail || !newEmail || newEmail === email}
                            >
                              {isChangingEmail ? "A enviar..." : "Confirmar"}
                            </Button>
                            <Button
                              appearance="outline"
                              variant="neutral"
                              onClick={() => {
                                setIsEditingEmail(false);
                                setNewEmail("");
                              }}
                              disabled={isChangingEmail}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            appearance="outline"
                            variant="neutral"
                            hasIcon
                            leadingIcon="agora-line-edit"
                            leadingIconHover="agora-solid-edit"
                            onClick={() => {
                              setIsEditingEmail(true);
                              setNewEmail(email);
                            }}
                          >
                            Alterar e-mail
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-end gap-[16px]">
                    <div className="flex-1">
                      <InputText
                        label="Senha"
                        placeholder="••••••••"
                        id="password"
                        type="password"
                        readOnly
                      />
                    </div>
                    {!samlLogin && (
                      <Button
                        appearance="outline"
                        variant="neutral"
                        hasIcon
                        leadingIcon="agora-line-edit"
                        leadingIconHover="agora-solid-edit"
                        onClick={() =>
                          show(<ChangePasswordPopupContent />, {
                            title: "Altere a sua senha",
                            closeAriaLabel: "Fechar",
                            dimensions: "m",
                          })
                        }
                      >
                        Alterar senha
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-[16px]">
                  <Button
                    variant="primary"
                    hasIcon={true}
                    leadingIcon="agora-line-check-circle"
                    leadingIconHover="agora-solid-check-circle"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "A guardar..." : "Guardar"}
                  </Button>
                </div>
              </div>
            </TabBody>
          </Tab>
          <Tab>
            <TabHeader>Atividades</TabHeader>
            <TabBody>
              <div className="mt-[24px]">
                {isLoadingActivities ? (
                  <p className="text-neutral-900 text-base">A carregar atividades...</p>
                ) : activities.length === 0 ? (
                  <p className="text-neutral-900 text-base">
                    Nenhuma atividade registada.
                  </p>
                ) : (
                  <div className="space-y-32">
                    {Object.entries(groupActivitiesByMonth(activities)).map(
                      ([month, acts]) => (
                        <div key={month}>
                          <h3 className="text-neutral-900 text-sm font-medium mb-16">
                            {month}
                          </h3>
                          <div className="relative border-l-2 border-neutral-200 ml-4">
                            {acts.map((act, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-16 pb-16 ml-16 relative"
                              >
                                <div className="absolute -left-[25px] top-1 w-8 h-8 rounded-full bg-neutral-300" />
                                <div className="flex-1 flex items-start justify-between">
                                  <div>
                                    <span className="text-sm">
                                      <Icon
                                        name="agora-line-user"
                                        className="w-4 h-4 inline text-primary-600 mr-4"
                                      />
                                      <span className="text-primary-600 font-medium">
                                        {act.actor.first_name} {act.actor.last_name}
                                      </span>
                                      {" ► "}
                                      <span className="text-neutral-900">{act.label}</span>
                                    </span>
                                    {act.related_to_url && (
                                      <div>
                                        <a
                                          href={act.related_to_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary-600 text-sm underline"
                                        >
                                          {act.related_to}
                                          <Icon
                                            name="agora-line-external-link"
                                            className="w-3 h-3 inline ml-4"
                                          />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-neutral-900 text-sm whitespace-nowrap ml-16">
                                    {format(
                                      new Date(act.created_at),
                                      "d 'de' MMMM 'de' yyyy",
                                      { locale: pt }
                                    )}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                    {totalActivityPages > 1 && (
                      <div className="flex items-center justify-center gap-8 mt-32">
                        <Button
                          variant="primary"
                          appearance="outline"
                          onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                          disabled={activityPage === 1}
                        >
                          Anterior
                        </Button>
                        <span className="text-neutral-900 text-sm">
                          Página {activityPage} de {totalActivityPages}
                        </span>
                        <Button
                          variant="primary"
                          appearance="outline"
                          onClick={() =>
                            setActivityPage((p) =>
                              Math.min(totalActivityPages, p + 1)
                            )
                          }
                          disabled={activityPage === totalActivityPages}
                        >
                          Seguinte
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabBody>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
