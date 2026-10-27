import type { Direction, TabItem } from "./types";

export const getNextTab = <T extends string>(
  direction: Direction,
  tabs: readonly TabItem<T>[],
  activeTab: T,
): T => {
  const currentTabIndex = tabs.findIndex((tab) => tab.name === activeTab);
  const lastIndex = tabs.length - 1;

  const index = {
    left: currentTabIndex - 1 < 0 ? lastIndex : currentTabIndex - 1,
    right: currentTabIndex + 1 > lastIndex ? 0 : currentTabIndex + 1,
    last: lastIndex,
    first: 0,
  }[direction];
  return tabs[index].name;
};
