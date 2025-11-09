import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	jsonSchemaTransform,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import scalarFastifyApiReference from "@scalar/fastify-api-reference";
import { postsRoutes } from "./routes/posts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
	origin: "true",
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	credentials: true,
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Webhook API",
			description: "API for webhook management",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(scalarFastifyApiReference, {
	routePrefix: "/docs",
});

app.register(postsRoutes);

app.get("/", async () => {
	return {
		message: "Webhook API is running",
		status: "ok",
	};
});

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
	console.log("Server is running on port 3333");
});
