import { Post } from '../types/interfaces';
import { PostRepository } from '../data/PostRepository';
import { UserRepository } from '../data/UserRepository';

export class PostBusiness {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  getAllPosts(): Post[] {
    return this.postRepository.getAllPosts();
  }

  getPostById(id: number): Post | undefined {
    return this.postRepository.getPostById(id);
  }

  getPostsByAuthorId(authorId: number): { success: boolean; posts?: Post[]; errors?: string[] } {
    const user = this.userRepository.getUserById(authorId);
    
    if (!user) {
      return { success: false, errors: ['Autor não encontrado'] };
    }
    
    const posts = this.postRepository.getPostsByAuthorId(authorId);
    return { success: true, posts };
  }

  createPost(title: string, content: string, authorId: number): { success: boolean; post?: Post; errors?: string[] } {
    const errors: string[] = [];

    if (!title || typeof title !== 'string' || title.length < 3) {
      errors.push('O título deve ter no mínimo 3 caracteres');
    }

    if (!content || typeof content !== 'string' || content.length < 10) {
      errors.push('O conteúdo deve ter no mínimo 10 caracteres');
    }

    if (!authorId) {
      errors.push('O ID do autor é obrigatório');
    } else {
      const authorExists = this.userRepository.getUserById(authorId);
      if (!authorExists) {
        errors.push('O autor informado não existe');
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const newPost = this.postRepository.createPost({
      title,
      content,
      authorId,
      published: false
    });

    return { success: true, post: newPost };
  }

  updatePost(postId: number, postData: Partial<Post>): { success: boolean; post?: Post; errors?: string[] } {
    const errors: string[] = [];
    
    const disallowedFields = ['id', 'authorId', 'createdAt'];
    const receivedFields = Object.keys(postData);
    
    const illegalFields = receivedFields.filter(field => disallowedFields.includes(field));
    if (illegalFields.length > 0) {
      errors.push(`Os campos ${illegalFields.join(', ')} não podem ser atualizados`);
    }

    if ('title' in postData) {
      const { title } = postData;
      if (typeof title !== 'string' || title.length < 3) {
        errors.push('O título deve ter no mínimo 3 caracteres');
      }
    }

    if ('content' in postData) {
      const { content } = postData;
      if (typeof content !== 'string' || content.length < 10) {
        errors.push('O conteúdo deve ter no mínimo 10 caracteres');
      }
    }

    if ('published' in postData) {
      const { published } = postData;
      if (typeof published !== 'boolean') {
        errors.push('O campo published deve ser um valor booleano (true/false)');
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const filteredData: Partial<Post> = {};
    if ('title' in postData) filteredData.title = postData.title;
    if ('content' in postData) filteredData.content = postData.content;
    if ('published' in postData) filteredData.published = postData.published;

    const updatedPost = this.postRepository.updatePost(postId, filteredData);
    if (!updatedPost) {
      return { success: false, errors: ['Post não encontrado'] };
    }

    return { success: true, post: updatedPost };
  }

  deletePostWithAuth(postId: number, userId: number): { success: boolean; errors?: string[] } {
    const post = this.postRepository.getPostById(postId);
    
    if (!post) {
      return { success: false, errors: ['Post não encontrado'] };
    }
    
    const user = this.userRepository.getUserById(userId);
    
    if (!user) {
      return { success: false, errors: ['Usuário não encontrado'] };
    }
    
    if (post.authorId !== userId && user.role !== 'admin') {
      return { 
        success: false, 
        errors: ['Sem permissão para excluir este post. Apenas o autor ou administradores podem excluir.'] 
      };
    }
    
    const deleted = this.postRepository.deletePost(postId);
    
    return { success: deleted };
  }
}