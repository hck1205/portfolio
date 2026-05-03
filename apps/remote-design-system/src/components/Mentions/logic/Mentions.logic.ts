import type { MentionOptionData, MentionSearchState } from "../types/Mentions.types";

export function getMentionSearchState(value: string, caretIndex: number, prefixes: string[]): MentionSearchState | undefined {
  const textBeforeCaret = value.slice(0, caretIndex);
  let match: MentionSearchState | undefined;

  for (const prefix of prefixes) {
    const start = textBeforeCaret.lastIndexOf(prefix);

    if (start < 0) {
      continue;
    }

    const charBeforePrefix = start > 0 ? textBeforeCaret[start - 1] : "";
    const query = textBeforeCaret.slice(start + prefix.length);

    if (charBeforePrefix && !/\s/.test(charBeforePrefix)) {
      continue;
    }

    if (/\s/.test(query)) {
      continue;
    }

    if (!match || start > match.start) {
      match = {
        prefix,
        query,
        start
      };
    }
  }

  return match;
}

export function filterMentionOptions(options: MentionOptionData[], query: string, enabled: boolean) {
  if (!enabled || !query) {
    return options;
  }

  const normalizedQuery = query.toLocaleLowerCase();

  return options.filter((option) => {
    return (
      option.label.toLocaleLowerCase().includes(normalizedQuery) ||
      option.value.toLocaleLowerCase().includes(normalizedQuery)
    );
  });
}

export function getNextActiveOptionIndex({
  currentIndex,
  direction,
  options
}: {
  currentIndex: number;
  direction: 1 | -1;
  options: MentionOptionData[];
}) {
  if (options.length === 0) {
    return -1;
  }

  for (let offset = 1; offset <= options.length; offset += 1) {
    const nextIndex = (currentIndex + offset * direction + options.length) % options.length;

    if (!options[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}

export function applyMentionSelection({
  option,
  search,
  selectionEnd,
  split,
  value
}: {
  option: MentionOptionData;
  search: MentionSearchState;
  selectionEnd: number;
  split: string;
  value: string;
}) {
  const beforeMention = value.slice(0, search.start);
  const afterMention = value.slice(selectionEnd);
  const insertedMention = `${search.prefix}${option.value}${split}`;
  const nextValue = `${beforeMention}${insertedMention}${afterMention}`;

  return {
    caretIndex: beforeMention.length + insertedMention.length,
    value: nextValue
  };
}
