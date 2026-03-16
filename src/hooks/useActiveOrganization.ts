"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserProfile } from "@/services/api";
import { Organization } from "@/types/api";

export function useActiveOrganization() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizations() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await fetchUserProfile(user.id);
        const orgs = profile?.organizations ?? [];
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setActiveOrg(orgs[0]);
        }
      } catch (error) {
        console.error("Error loading user organizations:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrganizations();
  }, [user]);

  const selectOrganization = useCallback(
    (orgId: string) => {
      const org = organizations.find((o) => o.id === orgId);
      if (org) setActiveOrg(org);
    },
    [organizations],
  );

  return {
    organizations,
    activeOrg,
    isLoading,
    hasOrganization: organizations.length > 0,
    selectOrganization,
  };
}
