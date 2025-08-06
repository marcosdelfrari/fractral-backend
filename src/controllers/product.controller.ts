import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const produtos = await prisma.product.findMany();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, descricao, preco, estoque, categoria } = req.body;
    
    if (!nome || !preco || !estoque || !categoria) {
      res.status(400).json({ 
        error: 'Nome, preço, estoque e categoria são obrigatórios' 
      });
      return;
    }

    const produto = await prisma.product.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria
      }
    });

    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
