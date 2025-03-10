// Full podcast data structure for display
export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  category: PodcastCategory;
  duration: string;
  date: string;
  imageUrl: string | null;
  audioUrl: string;
  linkUrl: string;
  itunesTitle?: string;
}

// Category definition
export interface PodcastCategory {
  id: string;
  name: string;
  search: string;
}

// Star Trek podcast categories
export const podcastCategories: PodcastCategory[] = [
  { id: "tos", name: "The Original Series", search: "(TOS " },
  { id: "tas", name: "The Animated Series", search: "(TAS " },
  { id: "tng", name: "The Next Generation", search: "(TNG " },
  { id: "ds9", name: "Deep Space Nine", search: "(DS9 " },
  { id: "voy", name: "Voyager", search: "(VOY " },
  { id: "mov", name: "Movies", search: "(MOV " },
  { id: "extra", name: "Extra", search: "" },
];
