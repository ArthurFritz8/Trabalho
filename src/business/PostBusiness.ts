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
    
    // Verificar campos não permitidos
    const disallowedFields = ['id', 'authorId', 'createdAt'];
    const receivedFields = Object.keys(postData);
    
    const illegalFields = receivedFields.filter(field => disallowedFields.includes(field));
    if (illegalFields.length > 0) {
      errors.push(`Os campos ${illegalFields.join(', ')} não podem ser atualizados`);
    }

    // Validar campos se estiverem presentes
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

    // Remover campos não permitidos
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

  deletePost(postId: number): boolean {
    return this.postRepository.deletePost(postId);
  }
}