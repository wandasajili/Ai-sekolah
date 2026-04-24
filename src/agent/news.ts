import newsData from "../../database/news.json";

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
}

export class NewsAgent {
  private news: NewsItem[] = newsData;

  getAllNews() {
    return this.news;
  }

  searchNews(query: string) {
    const lowercaseQuery = query.toLowerCase();
    return this.news.filter(n => 
      n.title.toLowerCase().includes(lowercaseQuery) || 
      n.summary.toLowerCase().includes(lowercaseQuery) ||
      n.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  getNewsById(id: number) {
    return this.news.find(n => n.id === id);
  }
}
