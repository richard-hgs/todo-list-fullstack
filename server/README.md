

## Passos para compilar e testar o servidor

1) Instalar as dependencias do projeto
```bash
yarn install
```

2) Criae o banco de dados mysql
```bash
mysql -u root -p
CREATE DATABASE todo_list_fullstack;
```

3) Forneça permissoes ao novo banco de dados criado ao usuário definido no arquivo de
Ambiente ".env"
```bash
GRANT ALL PRIVILEGES ON todo_list_fullstack.* TO 'root'@'localhost' WITH GRANT OPTION;
```

4) Crie o banco de dados ao executar o script de migração do prisma
```bash
npm run prisma:migrate-dev
```

5) Gere as classes do NoSQL do Prisma
```bash
npm run prisma:generate
```

6) Execute o servidor de emails de teste mailhog
```bash
npm run mailhog:dev
```

8) Abra a caixa de entrada do servidor de e-mails de teste mailhog
Ele será usado para ativar a conta do usuário, para isso clique no botao "Activate Your Account"
```
http://localhost:8025/
```

7) Execute o servidor de apis express + nestjs + prisma + swagger
```bash
npm run start:dev
```

8) Abra a documentação de api's "swagger" no navegador para testar as api's direto no navegador.
OBSERVAÇÃO: Algumas api's necessitam do uso do token jwt para isso use a api de "auth" para gerar o token de acesso,
copie esse token e clique no botao "Authorize" not topo da página a direita, cole e clique em "Authorize".
Feito isso todas as apis que necessitam de autorização irão funcionar.
```
http://localhost:3000/swagger/
```

9) Executar teste automatizado Jest:
```bash
npm run test 
```