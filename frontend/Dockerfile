# Etapa de build
FROM node:14 AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte
COPY . .

# Compila a aplicação React
RUN npm run build

# Etapa de produção
FROM nginx:alpine

# Copia os arquivos estáticos do build anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copia o arquivo de configuração personalizado do NGINX, se necessário
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponha a porta que o NGINX vai usar
EXPOSE 80

# Comando padrão para iniciar o NGINX
CMD ["nginx", "-g", "daemon off;"]
