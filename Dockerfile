# Use a imagem oficial do MongoDB como base
FROM mongo:latest
# Instale o pacote 'mongodb-database-tools' dentro do contêiner
RUN apt-get update && apt-get install -y mongodb-database-tools
