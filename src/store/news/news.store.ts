import { INew } from "@/src/interfaces/news.interface";
import { NewsService } from "@/src/services/news/news.service";
import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface NewsStore {
  news: INew[];
  getAndSetNews: () => Promise<void>;
  getAllNews: () => INew[];
  getNewsById: (id: string) => INew | undefined;
}

const storeAPI: StateCreator<
  NewsStore,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  NewsStore
> = (set, get) => ({
  news: [],
  getAndSetNews: async () => {
    try {
      const news = await NewsService.getNews();
      set({ news: [...news] });
    } catch (error) {
      console.warn(error);
    }
  },
  getAllNews: () => get().news,
  getNewsById: (id: string) => get().news.find((news) => news.id === id),
});

export const useNewsStore = create<NewsStore>()(
  immer(devtools(persist(storeAPI, { name: "news-store" })))
);
