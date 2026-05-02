export function getNextSelectedKeys({
  key,
  multiple,
  selectedKeys
}: {
  key: string;
  multiple: boolean;
  selectedKeys: string[];
}) {
  if (!multiple) {
    return [key];
  }

  return selectedKeys.includes(key) ? selectedKeys.filter((selectedKey) => selectedKey !== key) : [...selectedKeys, key];
}

export function getNextOpenKeys({
  accordion,
  key,
  open,
  openKeys
}: {
  accordion: boolean;
  key: string;
  open: boolean;
  openKeys: string[];
}) {
  if (open) {
    return accordion ? [key] : [...new Set([...openKeys, key])];
  }

  return openKeys.filter((openKey) => openKey !== key);
}
