import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { ApiResponse } from "../types/interfaces";

export class UserController {
  private userBusiness: UserBusiness;

  constructor() {
    this.userBusiness = new UserBusiness();
  }

  getAllUsers = (req: Request, res: Response) => {
    try {
      console.log('GET /users - Listando todos os usuários');
      const users = this.userBusiness.getAllUsers();
        
      const response: ApiResponse = {
        success: true,
        message: 'Usuários recuperados com sucesso',
        data: users,
        total: users.length
      };
        
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários',
        errors: [error.message || 'Erro interno do servidor']
      });
    }
  }
        
  getUserById = (req: Request, res: Response) => {
    try {
      console.log(`GET /users/${req.params.id} - Buscando usuário por ID`);
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido. O ID deve ser um número.',
          errors: ['ID inválido']
        });
      }

      const user = this.userBusiness.getUserById(userId);
          
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
          errors: ['Usuário não encontrado com o ID fornecido']
        });
      }

      const response: ApiResponse = {
        success: true,
        message: 'Usuário encontrado com sucesso',
        data: user
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
        errors: [error.message || 'Erro interno do servidor']
      });
    }
  }
    
  getUsersByAgeRange = (req: Request, res: Response) => {
    try {
      console.log('GET /users/age-range - Filtrando usuários por faixa etária');

      const minAgeParam = req.query.min;
      const maxAgeParam = req.query.max;

      let minAge: number | undefined = undefined;
      let maxAge: number | undefined = undefined;
      const errors: string[] = [];

      if (minAgeParam !== undefined) {
        minAge = Number(minAgeParam);
        if (isNaN(minAge)) {
          errors.push('O parâmetro min deve ser um número válido');
        }
      }

      if (maxAgeParam !== undefined) {
        maxAge = Number(maxAgeParam);
        if (isNaN(maxAge)) {
          errors.push('O parâmetro max deve ser um número válido');
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros de consulta inválidos',
          errors
        });
      }

      const filteredUsers = this.userBusiness.getUsersByAgeRange(minAge, maxAge);

      const response: ApiResponse = {
        success: true,
        message: 'Usuários filtrados por faixa etária',
        data: filteredUsers,
        total: filteredUsers.length
      };
    
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao filtrar usuários',
        errors: [error.message || 'Erro interno do servidor']
      });
    }
  }

  updateUser = (req: Request, res: Response) => {
    try {
      console.log(`PUT /users/${req.params.id} - Atualizando usuário`);

      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido. O ID deve ser um número.',
          errors: ['ID inválido']
        });
      }

      const result = this.userBusiness.updateUser(userId, req.body);

      if (!result.success) {
        return res.status(result.errors?.includes('Usuário não encontrado') ? 404 : 400).json({
          success: false,
          message: 'Dados inválidos',
          errors: result.errors
        });
      }

      const response: ApiResponse = {
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: result.user
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário',
        errors: [error.message || 'Erro interno do servidor']
      });
    }
  }

  cleanupInactiveUsers = (req: Request, res: Response) => {
    try {
      console.log('DELETE /users/cleanup-inactive - Removendo usuários inativos');
      
      const confirmParam = req.query.confirm;
      const confirm = confirmParam === 'true';
      
      const result = this.userBusiness.cleanupInactiveUsers(confirm);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Operação falhou',
          errors: result.errors
        });
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Usuários inativos removidos com sucesso',
        data: result.removedUsers,
        total: result.removedUsers?.length
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover usuários inativos',
        errors: [error.message || 'Erro interno do servidor']
      });
    }
  }

  verify = (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório',
          errors: ['Campo email é obrigatório']
        });
      }
      
      const user = this.userBusiness.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
          errors: ['Usuário com o email fornecido não existe']
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Usuário verificado com sucesso',
        data: user
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar usuário',
        errors: [error.message || 'Erro interno do servidor']
      });
    }
  }
}