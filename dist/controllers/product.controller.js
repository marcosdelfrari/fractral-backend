"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getAllProducts = void 0;
const prisma_1 = require("../lib/prisma");
const getAllProducts = async (_, res) => {
    try {
        const produtos = await prisma_1.prisma.product.findMany();
        res.json(produtos);
    }
    catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAllProducts = getAllProducts;
const createProduct = async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria } = req.body;
        if (!nome || !preco || !estoque || !categoria) {
            res.status(400).json({
                error: 'Nome, preço, estoque e categoria são obrigatórios'
            });
            return;
        }
        const produto = await prisma_1.prisma.product.create({
            data: {
                nome,
                descricao,
                preco: parseFloat(preco),
                estoque: parseInt(estoque),
                categoria
            }
        });
        res.status(201).json(produto);
    }
    catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=product.controller.js.map