# Deploy em Máquina em Núvem (Ubuntu)

## Atualize pacotes
- sudo apt update && sudo apt upgrade -y

## Instale o Docker
- sudo apt install docker.io -y

## Habilite e inicie o Docker
- sudo systemctl enable docker
- sudo systemctl start docker

## Instale o docker compose
- sudo apt install docker-compose -y

## Adicione o usuário 'ubuntu' ao grupo docker (evita precisar de sudo sempre)
- sudo usermod -aG docker $USER

## Execute o docker compose na raiz desse repositório
- docker compose up --build -d; ou
- sudo docker compose up --build -d; ou
- docker-compose up --build -d; ou 
- sudo docker-compose up --build -d;

## Restart server (vide variações acima)
- docker compose down
- docker compose up --build -d