import { links } from "./profile";

export interface CodingProfile {
  id: string;
  name: string;
  username: string;
  url: string;
  buttonLabel: string;
  stats: { label: string; value: string }[];
  description: string;
}

export const codingProfiles: CodingProfile[] = [
  {
    id: "leetcode",
    name: "LeetCode",
    username: "ww_heisenberg_",
    url: links.leetcode,
    buttonLabel: "View LeetCode Profile",
    description: "Practicing algorithmic problem solving across languages.",
    stats: [
      { label: "Rank", value: "112,131" },
      { label: "Java solved", value: "562" },
      { label: "C++ solved", value: "59" },
      { label: "MySQL solved", value: "56" },
      { label: "Total solved", value: "677" },
      { label: "Badges earned", value: "13" },
    ],
  },
  {
    id: "codechef",
    name: "CodeChef",
    username: "pavan_1306",
    url: links.codechef,
    buttonLabel: "View CodeChef Profile",
    description: "Competitive programming across rated contests.",
    stats: [
      { label: "Current rating", value: "1679 (3★, Div 2, provisional)" },
      { label: "Highest rating", value: "1679" },
      { label: "Global rank", value: "8761" },
      { label: "Country rank (India)", value: "7982" },
      { label: "Problems solved", value: "191" },
      { label: "Contests participated", value: "40" },
    ],
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    username: "SQL (Advanced) Certificate",
    url: links.hackerrank,
    buttonLabel: "View Certificate",
    description:
      "SQL (Advanced) Certificate, issued to Pragada Pavankumar, covering query optimization, data modeling, indexing, window functions and pivots in SQL. Evidence of SQL/database problem-solving skill.",
    stats: [],
  },
  {
    id: "github",
    name: "GitHub",
    username: "Pk1316",
    url: links.github,
    buttonLabel: "View GitHub",
    description: "18 public repositories.",
    stats: [],
  },
];

export const problemSolvingFlow = [
  { source: "GitHub", action: "Building" },
  { source: "LeetCode", action: "Algorithms" },
  { source: "CodeChef", action: "Competitive Problem Solving" },
  { source: "HackerRank", action: "SQL" },
];

export const problemSolvingCentralMessage = "Build / Solve / Learn / Improve";
