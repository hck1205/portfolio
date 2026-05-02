import { MENTION_OPTION_ELEMENT_NAME, MENTIONS_ELEMENT_NAME } from "../constants/Mentions.constants";
import { DsMentionOption } from "../MentionOption";
import { DsMentions } from "../Mentions";

export function defineDsMentions(registry: CustomElementRegistry = customElements) {
  if (!registry.get(MENTION_OPTION_ELEMENT_NAME)) {
    registry.define(MENTION_OPTION_ELEMENT_NAME, DsMentionOption);
  }

  if (!registry.get(MENTIONS_ELEMENT_NAME)) {
    registry.define(MENTIONS_ELEMENT_NAME, DsMentions);
  }
}
