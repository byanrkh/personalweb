import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert prose-zinc max-w-none
      prose-headings:font-medium prose-headings:text-zinc-50
      prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-zinc-100
      prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-zinc-700 prose-blockquote:text-zinc-400
      prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none
      prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950
      prose-img:rounded-lg prose-img:border prose-img:border-zinc-900
      prose-hr:border-zinc-800"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
