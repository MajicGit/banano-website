import { blogApiKey, blogApiUrl, shallowPostFields } from '$lib/ts/constants/blog';
import type { IBlogPosts } from '$lib/ts/interfaces/Blog';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	try {
		const slug = String(params.slug);
		const url = `${blogApiUrl}/posts/slug/${slug}?key=${blogApiKey}&include=tags`;
		const res = await fetch(url);
		const resJson: IBlogPosts = await res.json();
		const post = resJson.posts[0];

		const urlSimilars = `${blogApiUrl}/posts?key=${blogApiKey}&fields=${shallowPostFields.join(
			','
		)}&limit=4&filter=tag:[${post.tags.map((i) => i.slug).join(',')}]`;
		const resSimilars = await fetch(urlSimilars);
		const resJsonSimilars: IBlogPosts = await resSimilars.json();
		const similarPosts = resJsonSimilars.posts.filter((i) => i.id !== post.id).slice(3);

		if (post && post.title) {
			return {
				status: 200,
				body: { post: post as any, similarPosts: similarPosts as any }
			};
		} else {
			return {
				status: 404,
				body: { error: 'Post not found' }
			};
		}
	} catch (e: any) {
		return {
			status: 404,
			body: { error: String(e) }
		};
	}
};
