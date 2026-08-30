/**
 * useShareRecipientSearch Hook
 *
 * Debounced org-user search for the "share with" recipient picker.
 * Cancels the in-flight request when the query changes or the component unmounts.
 */

import { useEffect, useRef, useState } from "react";
import { useTenantId } from "@/core/tenant/hooks/useTenant";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { searchShareRecipients } from "../api/shareRecipients-api";
import { logger } from "@/shared/utils/logger";
import type { ShareRecipientUser } from "../types/documentShare.types";

const log = logger.createScoped("useShareRecipientSearch");
const MIN_QUERY_LENGTH = 2;

interface UseShareRecipientSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: ShareRecipientUser[];
  isLoading: boolean;
  isError: boolean;
}

export function useShareRecipientSearch(): UseShareRecipientSearchResult {
  const tenant = useTenantId();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<ShareRecipientUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();

    if (!tenant || debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setIsError(false);

    searchShareRecipients(tenant, debouncedQuery.trim(), controller.signal)
      .then((users) => {
        if (!controller.signal.aborted) setResults(users);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          log.error("Recipient search failed", { error });
          setIsError(true);
          setResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [tenant, debouncedQuery]);

  return { query, setQuery, results, isLoading, isError };
}
