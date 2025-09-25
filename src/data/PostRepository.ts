import { Post } from '../types/interfaces';
import { posts } from './database';

export class PostRepository {
  getAllPosts(): Post[] {
    return posts;
  }

  getPostById(id: number): Post | undefined {
    return posts.find(p => p.id === id);
  }

  getPostsByAuthorId(authorId: number): Post[] {
    return posts.filter(p => p.authorId === authorId);
  }

  createPost(post: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      ...post,
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      createdAt: new Date()
    };
    posts.push(newPost);
    return newPost;
  }

  updatePost(postId: number, postData: Partial<Post>): Post | null {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    posts[postIndex] = {
      ...posts[postIndex],
      ...postData
    };
    return posts[postIndex];
  }

  deletePost(id: number): boolean {
    const initialLength = posts.length;
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    }
    return false;
  }
}