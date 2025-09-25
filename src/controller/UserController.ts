import {Request, Response} from "express"
import { UserBusiness } from "../business/UserBusiness";
import { ApiResponse } from "../types/interfaces";

export class UserController{
    private userBusiness: UserBusiness;

    constructor() {
        this.userBusiness = new UserBusiness();
    }

    getAllUsers = (_req: Request, res: Response) => {
        console.log(' GET /users - Listando todos os usuários');
        
        const users = this.userBusiness.getAllUsers();
        
        const response: ApiResponse = {
            success: true,
            message: 'Usuários recuperados com sucesso',
            data: users,
            total: users.length
        };
        
        return res.status(200).json(response);
    }

    getUserById = (req: Request, res: Response) => {
        console.log(` GET /users/${req.params.id} - Buscando usuário por ID`);

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
        
        return res.status(200).json(response);
    }

    getUsersByAgeRange = (req: Request, res: Response) => {
        console.log(' GET /users/age-range - Filtrando usuários por faixa etária');

        const { min, max } = req.query;
        const errors: string[] = [];

        const minAge = min ? parseInt(min as string) : undefined;
        const maxAge = max ? parseInt(max as string) : undefined;

        if (min && isNaN(minAge!)) {
            errors.push('O parâmetro "min" deve ser um número válido');
        }

        if (max && isNaN(maxAge!)) {
            errors.push('O parâmetro "max" deve ser um número válido');
        }

        if (minAge && maxAge && minAge > maxAge) {
            errors.push('A idade mínima não pode ser maior que a idade máxima');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Parâmetros inválidos',
                errors
            });
        }

        const filteredUsers = this.userBusiness.getUsersByAgeRange(minAge, maxAge);

        const response: ApiResponse = {
            success: true,
            message: 'Usuários filtrados com sucesso',
            data: filteredUsers,
            total: filteredUsers.length
        };

        return res.status(200).json(response);
    }

    updateUser = (req: Request, res: Response) => {
        console.log(` PUT /users/${req.params.id} - Atualizando usuário completamente`);

        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido. O ID deve ser um número.',
                errors: ['ID inválido']
            });
        }

        const result = this.userBusiness.updateUser(userId, {
            id: userId,
            ...req.body
        });

        if (!result.success) {
            return res.status(result.errors?.includes('Usuário não encontrado') ? 404 : 400).json({
                success: false,
                message: result.errors?.includes('Email duplicado') ? 'Email já está em uso por outro usuário' : 'Dados inválidos',
                errors: result.errors
            });
        }

        const response: ApiResponse = {
            success: true,
            message: 'Usuário atualizado com sucesso',
            data: result.user
        };

        return res.status(200).json(response);
    }
}