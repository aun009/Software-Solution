export const STORE_RETURN_PENDING_KEY = 'sp_store_return_pending';
const STORE_RETURN_PRODUCT_ID_KEY = 'sp_store_return_product_id';
const STORE_RETURN_TARGET_KEY = 'sp_store_return_target';
const LEGACY_STORE_SCROLL_KEY = 'store_scroll_y';

export interface StoreReturnState {
  isPending: boolean;
  productId: string | null;
  targetId: string | null;
}

export const disableNativeScrollRestoration = () => {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
};

export const markStoreReturnPending = (productId?: string, targetId?: string) => {
  try {
    sessionStorage.setItem(STORE_RETURN_PENDING_KEY, '1');
    if (productId) sessionStorage.setItem(STORE_RETURN_PRODUCT_ID_KEY, productId);
    if (targetId) sessionStorage.setItem(STORE_RETURN_TARGET_KEY, targetId);
    sessionStorage.removeItem(LEGACY_STORE_SCROLL_KEY);
  } catch {
    /* storage unavailable */
  }
};

export const hasStoreReturnPending = () => {
  try {
    return sessionStorage.getItem(STORE_RETURN_PENDING_KEY) === '1';
  } catch {
    return false;
  }
};

export const consumeStoreReturnPending = (): StoreReturnState => {
  try {
    const isPending = sessionStorage.getItem(STORE_RETURN_PENDING_KEY) === '1';
    const productId = sessionStorage.getItem(STORE_RETURN_PRODUCT_ID_KEY);
    const targetId = sessionStorage.getItem(STORE_RETURN_TARGET_KEY);
    sessionStorage.removeItem(STORE_RETURN_PENDING_KEY);
    sessionStorage.removeItem(STORE_RETURN_PRODUCT_ID_KEY);
    sessionStorage.removeItem(STORE_RETURN_TARGET_KEY);
    sessionStorage.removeItem(LEGACY_STORE_SCROLL_KEY);
    return { isPending, productId, targetId };
  } catch {
    return { isPending: false, productId: null, targetId: null };
  }
};

export const clearStoreReturnState = () => {
  try {
    sessionStorage.removeItem(STORE_RETURN_PENDING_KEY);
    sessionStorage.removeItem(STORE_RETURN_PRODUCT_ID_KEY);
    sessionStorage.removeItem(STORE_RETURN_TARGET_KEY);
    sessionStorage.removeItem(LEGACY_STORE_SCROLL_KEY);
  } catch {
    /* storage unavailable */
  }
};

export const scrollToElementTop = (element: HTMLElement | null, offset = 88) => {
  if (typeof window === 'undefined') return;

  if (!element) {
    window.scrollTo(0, 0);
    return;
  }

  const top = Math.max(0, Math.round(element.getBoundingClientRect().top + window.scrollY - offset));
  window.scrollTo(0, top);
};
