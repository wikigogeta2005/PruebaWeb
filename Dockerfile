# --- ETAPA 1: Compilación de TypeScript ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc

# --- ETAPA 2: Servidor Web de Producción ---
FROM nginx:alpine

# ¡Aquí estaba el detalle! Copiamos el index.html desde la carpeta src[cite: 1]
COPY ./src/index.html /usr/share/nginx/html/index.html

# Copiamos los estilos manteniendo su estructura
COPY ./src/style.css /usr/share/nginx/html/src/style.css

# Copiamos la carpeta dist con el JS compilado
COPY --from=builder /app/dist /usr/share/nginx/html/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
