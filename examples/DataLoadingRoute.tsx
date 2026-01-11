import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

// Validation for search parameters
const searchSchema = z.object({
  category: z.string().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
});

/**
 * Example route with proper data loading pattern
 *
 * Key patterns:
 * - beforeLoad prefetches data with queryClient.ensureQueryData
 * - Search parameters are validated with Zod
 * - Component uses useSuspenseQuery with route context
 * - Backend client is used for type-safe API calls
 */
export const Route = createFileRoute("/posts/")({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, search }) => {
    const { backendClient, queryClient } = context;

    // Create query options for data prefetching
    const postsQueryOptions = {
      queryKey: ["posts", search],
      queryFn: () =>
        backendClient.api.posts
          .$get({
            query: {
              category: search.category,
              limit: search.limit || "10",
              page: search.page || "1",
            },
          })
          .then((resp) => resp.json()),
    };

    // Prefetch data on the server/during navigation
    await queryClient.ensureQueryData(postsQueryOptions);

    return {
      postsQueryOptions,
      backendClient,
    };
  },
  component: PostsPage,
});

function PostsPage() {
  const { postsQueryOptions, backendClient } = Route.useRouteContext();
  const search = Route.useSearch();

  // Use suspense query with prefetched data
  const { data: posts } = useSuspenseQuery(postsQueryOptions);

  const handleCreatePost = async (postData: {
    title: string;
    body: string;
  }) => {
    try {
      await backendClient.api.posts.$post({
        json: postData,
      });
      // Invalidate and refetch posts
      // Note: You'd get queryClient from context in a real component
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 font-bold text-2xl">Posts</h1>

      {/* Display current filters */}
      {search.category && (
        <p className="mb-4 text-gray-600 text-sm">
          Category: {search.category}
        </p>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div className="rounded-lg border p-4" key={post.id}>
            <h2 className="font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.body}</p>
            <small className="text-gray-500">
              By {post.username} •{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="py-12 text-center text-gray-500">
          No posts found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
