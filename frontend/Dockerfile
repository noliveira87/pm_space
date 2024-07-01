# Use a imagem base do Node.js
FROM node:14

# Configura o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários para o contêiner
COPY package.json package-lock.json /app/

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do projeto para o contêiner
COPY . /app/

# Expõe a porta 3000 para acesso externo (se necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
