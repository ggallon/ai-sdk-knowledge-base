import { convertToCoreMessages, streamText } from "ai";
import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createChatMessage } from "@/drizzle/query/chat";
import { AuthError } from "@/utils/functions";

export const POST = auth(async function POST(req) {
  try {
    if (!req.auth?.user?.id) {
      throw new AuthError("Unauthorized");
    }

    const { id: userId } = req.auth.user;
    const { publicId, messages, selectedFilePathnames } = await req.json();
    const result = await streamText({
      model: customModel,
      system:
        "you are a friendly assistant! keep your responses concise and helpful.",
      messages: convertToCoreMessages(messages),
      experimental_providerMetadata: {
        rag: {
          userId,
          selectedFilePathnames,
        },
      },
      onFinish: async ({ text }) => {
        await createChatMessage({
          publicId,
          ownerId: userId,
          messages: [...messages, { role: "assistant", content: text }],
        });
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "stream-text",
      },
    });

    return result.toDataStreamResponse({});
  } catch (error) {
    console.error(
      "API Error handling chat:",
      error instanceof Error ? error.message : String(error),
    );

    if (error instanceof AuthError) {
      return new Response(null, { status: 401 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
});
