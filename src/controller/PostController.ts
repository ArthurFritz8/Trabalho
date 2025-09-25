import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { ApiResponse } from "../types/interfaces";

export class PostController {
  private postBusiness: PostBusiness;

  constructor() {
    this.postBusiness = new PostBusiness();
  }

  createPost = (req: Request, res: Response) => {
    console.log('POST /posts - Criando um novo post');

    const { title, content, authorId } = req.body;
    
    const result = this.postBusiness.createPost(title, content, authorId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: result.errors
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Post criado com sucesso',
      data: result.post
    };

    return res.status(201).json(response);
  }

  updatePost = (req: Request, res: Response) => {
    console.log(`PATCH /posts/${req.params.id} - Atualizando post parcialmente`);

    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. O ID deve ser um número.',
        errors: ['ID inválido']
      });
    }

    const result = this.postBusiness.updatePost(postId, req.body);

    if (!result.success) {
      return res.status(result.errors?.includes('Post não encontrado') ? 404 : 400).json({
        success: false,
        message: result.errors?.[0].includes('não podem ser atualizados') 
          ? 'Campos não permitidos para atualização' 
          : 'Dados inválidos',
        errors: result.errors
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Post atualizado com sucesso',
      data: result.post
    };

    return res.status(200).json(response);
  }

  deletePost = (req: Request, res: Response) => {
    console.log(`DELETE /posts/${req.params.id} - Deletando post com autorização`);
    
    const postId = parseInt(req.params.id);
    const userId = parseInt(req.header('User-Id') || '');
    
    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. O ID deve ser um número.',
        errors: ['ID inválido']
      });
    }
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User-Id inválido ou não fornecido no header.',
        errors: ['User-Id inválido']
      });
    }
    
    const result = this.postBusiness.deletePostWithAuth(postId, userId);
    
    if (!result.success) {
      const isUnauthorized = result.errors?.some(e => e.includes('Sem permissão'));
      const statusCode = isUnauthorized ? 403 : result.errors?.includes('Post não encontrado') ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: isUnauthorized ? 'Não autorizado' : 'Operação falhou',
        errors: result.errors
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Post removido com sucesso'
    });
  }

  getAllPosts = (_req: Request, res: Response) => {
    console.log('GET /posts - Listando todos os posts');
    
    const posts = this.postBusiness.getAllPosts();
    
    const response: ApiResponse = {
      success: true,
      message: 'Posts recuperados com sucesso',
      data: posts,
      total: posts.length
    };
    
    return res.status(200).json(response);
}

  getPostById = (req: Request, res: Response) => {
    console.log(`GET /posts/${req.params.id} - Buscando post por ID`);

    const postId = parseInt(req.params.id);
    
    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. O ID deve ser um número.',
        errors: ['ID inválido']
      });
    }
    
    const post = this.postBusiness.getPostById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado',
        errors: ['Post não encontrado com o ID fornecido']
      });
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Post encontrado com sucesso',
      data: post
    };
    
    return res.status(200).json(response);
  }
}