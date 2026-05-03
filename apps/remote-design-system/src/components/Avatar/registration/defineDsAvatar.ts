import { AVATAR_ELEMENT_NAME, AVATAR_GROUP_ELEMENT_NAME } from "../constants/Avatar.constants";
import { DsAvatar, DsAvatarGroup } from "../Avatar";

export function defineDsAvatar(registry: CustomElementRegistry = customElements) {
  if (!registry.get(AVATAR_ELEMENT_NAME)) {
    registry.define(AVATAR_ELEMENT_NAME, DsAvatar);
  }

  if (!registry.get(AVATAR_GROUP_ELEMENT_NAME)) {
    registry.define(AVATAR_GROUP_ELEMENT_NAME, DsAvatarGroup);
  }
}
