import type { Message, CreateMessage, ChatRequestOptions } from "ai";
import { motion } from "framer-motion";

const actions = [
  {
    id: 1,
    title: "What's the summary",
    label: "of these documents?",
    message: "what's the summary of these documents?",
  },
  {
    id: 2,
    title: "Who is the author",
    label: "of these documents?",
    message: "who is the author of these documents?",
  },
];

export const SuggestedActions = ({
  appendSuggestedAction,
}: {
  appendSuggestedAction: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}) => {
  return (
    <div className="mx-auto grid w-full gap-2 px-4 sm:grid-cols-2 md:max-w-[500px] md:px-0">
      {actions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
          key={suggestedAction.id}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <button
            onClick={async () => {
              appendSuggestedAction({
                role: "user",
                content: suggestedAction.message,
              });
            }}
            className="flex w-full flex-col rounded-lg border border-zinc-200 p-2 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {suggestedAction.label}
            </span>
          </button>
        </motion.div>
      ))}
    </div>
  );
};
