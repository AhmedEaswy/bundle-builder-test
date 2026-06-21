type StableKeyPart = number | string | null | undefined;

const normalizeKeyPart = (value: StableKeyPart) => {
  if (value === null || value === undefined) return "";

  return String(value).trim();
};

export const useUUID = (id: StableKeyPart, fallback: StableKeyPart = null) => {
  const primary = normalizeKeyPart(id);
  if (primary) {
    return `stable-${primary}`;
  }

  const secondary = normalizeKeyPart(fallback);
  if (secondary) {
    return `stable-fallback-${secondary}`;
  }

  return "stable-missing-id";
};
