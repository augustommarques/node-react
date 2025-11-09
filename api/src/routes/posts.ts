import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

const postSchema = z.object({
	id: z.string(),
	content: z.string(),
	author: z.object({
		id: z.string(),
		username: z.string(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		profilePic: z.string().optional(),
	}),
	createdAt: z.string(),
	likes: z.array(z.string()).optional(),
	replies: z.array(z.any()).optional(),
	replyTo: z.string().optional().nullable(),
});

const getPostParamsSchema = z.object({
	id: z.string(),
});

export async function postsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/api/posts/:id",
		{
			schema: {
				params: getPostParamsSchema,
				response: {
					200: z.object({
						post: postSchema.nullable(),
						replyPosts: z.array(postSchema),
					}),
					404: z.object({
						message: z.string(),
						error: z.string(),
						statusCode: z.number(),
					}),
				},
			},
		},
		async (request, _reply) => {
			const { id } = request.params;

			// TODO: Implementar busca real no banco de dados
			// Por enquanto, retornando dados mockados
			const post = {
				id,
				content: "Post content example",
				author: {
					id: "1",
					username: "user1",
					firstName: "John",
					lastName: "Doe",
					profilePic: "",
				},
				createdAt: new Date().toISOString(),
				likes: [],
				replies: [],
				replyTo: null,
			};

			const replyPosts = [
				{
					id: "2",
					content: "Reply example",
					author: {
						id: "2",
						username: "user2",
						firstName: "Jane",
						lastName: "Smith",
						profilePic: "",
					},
					createdAt: new Date().toISOString(),
					likes: [],
					replies: [],
					replyTo: id,
				},
			];

			return {
				post,
				replyPosts,
			};
		},
	);
}
