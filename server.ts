import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(express.json())

const prisma = new PrismaClient()

//Realiza a busca de todos os usuários cadastrados:
app.get("/usuario", async (req, res) => {
    //Busca e retorna todos os usuários cadastrados:
    const usuarios = await prisma.usuario.findMany()
    return res.json(usuarios)
});


//Realiza a busca através de um id específico:
app.get("/usuario/:id", async (req, res) => {
    //Verifica se o id específicado pelo usuario existe, se existir retorna o usuario do id:
    const usuario = await prisma.usuario.findFirst({
        where:{
            id: Number(req.params.id)
        }
    });
    //Se não existir, retorna a mensagem abaixo:
    if(usuario == null){
        return res.send({ error: "Não foi possivel fazer a busca, o id específicado não foi encontrado!"})
    }
    return res.json(usuario)
});


//Realiza a criação de novos usuarios:
app.post("/usuario",async (req, res) => {
    //Contém os dados que foram enviados pelo usuario:
    const {nome, email} = req.body
    //Verifica se o email já existe:
    const emailExistente = await prisma.usuario.findFirst({
        where: {
            email: email
        }
    });
    //Se o email existe retorna a menssagem abaixo(o email é unico):
    if(emailExistente ){
        return res.send({ error: "Não foi possivel criar o usuário, o email específicado já existe!"})
    }
    //Senão Cria e retorna o novo usuario:
    else{
        const usuarioNovo = await prisma.usuario.create({
            data:{
            nome,
            email
            }
    });
    return res.json(usuarioNovo)
  }
});


//Realiza update dos usuarios através de um id específico:
app.put("/usuario/:id",async (req, res) => {
    //Contém o nome e email enviados pelo usuario:
    const {nome, email} = req.body
    const usuarioId = Number(req.params.id)
    //Verifica se o id informado existe:
    const usuarioExistente = await prisma.usuario.findFirst({
        where: {
            id: usuarioId
        }
    });
    //Se o usuario do id informado não existir, retorna a menssagem abaixo:
    if(usuarioExistente == null){
        return res.send({ error: "Não foi possivel fazer a atualização, o id específicado não foi encontrado!"})
    }
    //Se existir, o usuário do id específicado será atualizado:
    else{
        const atualizarUsuario = await prisma.usuario.update({
            where:{
                id: usuarioId
            },
            data:{
                nome,
                email
            }
    });

    return res.json(atualizarUsuario)
    }
});


//Realiza a exclusão do usuario através de um id específico:
app.delete("/usuario/:id",async (req, res) => {
    const excluirUsuario = Number(req.params.id)
    //Verifica se o usuário do id específicado existe:
    const usuarioExistente = await prisma.usuario.findFirst({
        where: {
            id: excluirUsuario
        }
    });
    //Se o usuário do id específicado não existir, a menssagem abaixo é retornada:
    if(usuarioExistente == null){
        return res.send({ error: "Não foi possivel excluir o usuário, o id específicado não foi encontrado!"})
    }
    //Senão o usuário do id específicado é excluido e a menssagem de sucesso é retornada:
    else{
        await prisma.usuario.delete({
            where:{
                id: excluirUsuario
            }
    });

    return res.json("Usuário excluido com sucesso!")
    }
});


app.listen(3333, ()=> console.log("Servidor Rodando..."))
