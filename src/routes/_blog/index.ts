import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	try {
		const postsUrl = 'https://utils.banano.cc/medium-posts';
		const res = await fetch(postsUrl);
		const resJson = await res.json();
		if (resJson && resJson.posts.length > 0) {
			return {
				status: 200,
				body: { posts: resJson.posts.slice(0, 9) }
			};
		} else {
			return {
				status: 404,
				body: { error: 'Posts not found' }
			};
		}
	} catch (error) {
		return {
			status: 404,
			body: { error: String(error) }
		};
	}
};
