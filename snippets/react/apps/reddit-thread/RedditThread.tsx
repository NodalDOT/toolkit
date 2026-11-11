import type { IRedditComment } from "./types";

export function RedditThread({ comments }: { comments: IRedditComment[] }) {
  return (
    <ul className="reddit-thread">
      {comments.map((comment) => (
        <li key={comment.id}>
          <RedditComment {...comment} />
        </li>
      ))}
    </ul>
  );
}

function RedditComment({ replies, text, nickname, date }: IRedditComment) {
  return (
    <article className="comment">
      <header className="comment-header">
        <strong>{nickname}</strong>
        <span className="comment-date">{date}</span>
      </header>
      <p className="comment-text">{text}</p>
      {replies.length > 0 && (
        <details className="comment-replies">
          <summary>
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </summary>
          <RedditThread comments={replies} />
        </details>
      )}
    </article>
  );
}
