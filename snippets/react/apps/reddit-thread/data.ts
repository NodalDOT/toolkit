import type { IRedditComment } from "./types";

export const comments: IRedditComment[] = [
  {
    id: "1",
    nickname: "friday_deployer",
    text: "Hooked up the office coffee machine to CI. It only makes coffee after a successful build.",
    date: "2 hours ago",
    replies: [
      {
        id: "2",
        nickname: "sleep_deprived",
        text: "So no coffee today either?",
        date: "1 hour ago",
        replies: [
          {
            id: "3",
            nickname: "friday_deployer",
            text: "Third day drinking hot water. Test coverage is looking great, though.",
            date: "50 minutes ago",
            replies: [],
          },
          {
            id: "4",
            nickname: "hotfix_master",
            text: "Add --skip-tests. That’s how our whole office gets breakfast.",
            date: "40 minutes ago",
            replies: [
              {
                id: "5",
                nickname: "security_cat",
                text: "Audited your pipeline. Your espresso endpoint has no authentication.",
                date: "20 minutes ago",
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: "6",
        nickname: "budget_devops",
        text: "Ours runs on Kubernetes. Still one coffee, but now with three replicas.",
        date: "30 minutes ago",
        replies: [],
      },
    ],
  },
  {
    id: "7",
    nickname: "product_owner",
    text: "Can you make the Cappuccino button bigger? Also, it should make tea.",
    date: "1 hour ago",
    replies: [
      {
        id: "8",
        nickname: "css_samurai",
        text: "Made the button bigger. Tea is currently served via ::before.",
        date: "15 minutes ago",
        replies: [],
      },
    ],
  },
];
