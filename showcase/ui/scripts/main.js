import { initNavFilter } from "./nav/filter.js";
import { initNavGroups } from "./nav/groups.js";
import { initNavItems } from "./nav/items.js";
import { initSidebar } from "./sidebar.js";
import { initTheme } from "./theme.js";

initTheme();
initSidebar();
initNavGroups();
initNavFilter();
initNavItems();
