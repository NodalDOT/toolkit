export interface IRedditComment {
  id: string;
  nickname: string;
  text: string;
  date: string;
  replies: IRedditComment[];
}
