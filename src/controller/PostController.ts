import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { ApiResponse } from "../types/interfaces";

export class PostController {
  private postBusiness: PostBusiness;

  constructor() {
    this.postBusiness = new PostBusiness();
  }

  createPost = (req: Request, res: Response) => {
    console.log(' POST /posts - Criando um novo post');

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
    console.log(` PATCH /posts/${req.params.id} - Atualizando post parcialmente`);

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
}