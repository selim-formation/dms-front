import { useCallback, useState } from 'react';
import type { PreviewLink } from '../types/version.types';

/**
 * Opens a 5-minute preview link in a new tab. The tab is opened synchronously
 * (inside the click) and pointed at the link once it arrives, so popup blockers
 * don't swallow it. `loadingKey` says which item is waiting for its link.
 */
export function useOpenPreview(onError: (error: unknown) => void) {
    const [loadingKey, setLoadingKey] = useState<string | null>(null);

    const open = useCallback(
        async (key: string, fetchLink: () => Promise<PreviewLink>) => {
            const tab = window.open('about:blank', '_blank');
            if (tab) tab.opener = null;
            setLoadingKey(key);
            try {
                const { url } = await fetchLink();
                if (tab) tab.location.href = url;
                else window.location.assign(url);
            } catch (error) {
                tab?.close();
                onError(error);
            } finally {
                setLoadingKey(null);
            }
        },
        [onError],
    );

    return { open, loadingKey };
}
