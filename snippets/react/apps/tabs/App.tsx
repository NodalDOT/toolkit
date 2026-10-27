import {
  Activity,
  startTransition,
  useId,
  useState,
  ViewTransition,
  useRef,
  type KeyboardEvent,
} from "react";
import { LongContent, MediumContent, RichContent } from "./content.tsx";
import { getNextTab } from "./utils.ts";
import type { Direction, TabButtonProps, TabsProps } from "./types.ts";

const DIRECTION_BY_KEY: Partial<Record<string, Direction>> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  Home: "first",
  End: "last",
};
const Tabs = <T extends string>({ tabs, defaultTab, label }: TabsProps<T>) => {
  if (tabs.length === 0) throw new Error("Tabs: expected at least one tab");
  if (new Set(tabs.map((tab) => tab.name)).size !== tabs.length)
    throw new Error("Tabs: tab names must be unique");

  const [selected, setSelected] = useState<T>(defaultTab ?? tabs[0].name);
  const activeTab = tabs.find((tab) => tab.name === selected) ?? tabs[0];
  const tabRefs = useRef(new Map<T, HTMLButtonElement>());

  const id = useId();
  const getTabId = (index: number) => `${id}-tab-${index}`;
  const getPanelId = (index: number) => `${id}-panel-${index}`;

  const select = (name: T) => startTransition(() => setSelected(name));

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const direction = DIRECTION_BY_KEY[event.key];
    if (!direction) return;
    event.preventDefault();
    const nextTab = getNextTab(direction, tabs, activeTab.name);

    select(nextTab);

    tabRefs.current.get(nextTab)?.focus();
  };
  return (
    <>
      <ul
        className="tabs"
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => {
          return (
            <li key={tab.name} role="presentation">
              <TabButton
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.name, el);
                  return () => {
                    tabRefs.current.delete(tab.name);
                  };
                }}
                isActive={tab.name === activeTab.name}
                name={tab.name}
                id={getTabId(index)}
                panelId={getPanelId(index)}
                onSelect={() => select(tab.name)}
              />
            </li>
          );
        })}
      </ul>

      <ViewTransition default="tab-panel">
        <div>
          {tabs.map((tab, index) => (
            <Activity
              key={tab.name}
              mode={tab.name === activeTab.name ? "visible" : "hidden"}
            >
              <section
                role="tabpanel"
                id={getPanelId(index)}
                tabIndex={0}
                aria-labelledby={getTabId(index)}
              >
                {tab.content}
              </section>
            </Activity>
          ))}
        </div>
      </ViewTransition>
    </>
  );
};

const TabButton = ({
  name,
  isActive,
  id,
  panelId,
  ref,
  onSelect,
}: TabButtonProps) => {
  return (
    <button
      aria-controls={panelId}
      aria-selected={isActive}
      role="tab"
      ref={ref}
      type="button"
      tabIndex={isActive ? 0 : -1}
      id={id}
      className="tab"
      onClick={onSelect}
    >
      {name}
    </button>
  );
};

export function App() {
  return (
    <main>
      <Tabs
        label="Demo sections"
        tabs={[
          { name: "Tab-1", content: <LongContent /> },
          { name: "Tab-2", content: <MediumContent /> },
          { name: "Tab-3", content: <RichContent /> },
        ]}
      />
    </main>
  );
}
