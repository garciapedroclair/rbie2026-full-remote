# 📘 README — Acesso SSH limpo na Magalu Cloud (Ubuntu + Windows/WSL)

Este documento descreve o procedimento do zero para:
- Limpar o ambiente local (Ubuntu no Windows / WSL)
- Criar uma nova chave SSH
- Cadastrar a chave na Magalu Cloud
- Criar uma instância Ubuntu
- Acessar via SSH sem `.pem` e sem erro

---

## 🧹 1. Limpeza do ambiente local (WSL)

⚠️ Atenção: isso remove chaves SSH antigas somente no Ubuntu/WSL, não afeta o Windows.

Manter apenas o projeto (`poc_fse`):

    rm -rf ~/.ssh
    rm -rf *.pem

Confirme que só ficou o projeto:

    ls

Resultado esperado:
    poc_fse

---

## 🔑 2. Criar uma nova chave SSH (recomendado: ed25519)

    mkdir -p ~/.ssh
    ssh-keygen -t ed25519 -C "pedro@magalu-poc"

- Quando perguntar o caminho → ENTER
- Senha → opcional (ENTER para deixar em branco)

Verifique:

    ls ~/.ssh

Resultado esperado:
    id_ed25519
    id_ed25519.pub

---

## 📋 3. Copiar a chave pública

    cat ~/.ssh/id_ed25519.pub

Exemplo de saída:
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... pedro@magalu-poc

➡️ Copiar a linha inteira, sem aspas e sem quebra de linha.

---

## ☁️ 4. Cadastrar a chave na Magalu Cloud

No painel da Magalu Cloud:

1. Vá em **Chaves SSH**
2. Clique em **Criar nova chave**
3. Nome sugerido: `home-plataform`
4. Cole a chave pública copiada
5. Salve

---

## 🖥️ 5. Criar a instância Ubuntu

Durante a criação da VM:

- Imagem: Ubuntu 24.04 LTS
- Usuário SSH: `ubuntu`
- Chave SSH: `home-plataform`
- Firewall mínimo:
  - IN: 22/TCP (SSH)
  - OUT: tudo liberado

⚠️ Não usar `.pem`  
⚠️ Não usar chave diferente

---

## 🔐 6. Acessar a instância via SSH

Após o status ficar **Ligado**, usar:

    ssh ubuntu@IP_PUBLICO

Exemplo:
    ssh ubuntu@201.23.76.255

Na primeira conexão, confirme:
    yes

---

## ✅ Resultado esperado

    ubuntu@nome-da-instancia:~$

Acesso funcionando sem erro `Permission denied (publickey)`.

---

## ❌ Problemas comuns

- **Permission denied (publickey)**  
  A instância não foi criada com a chave correta → recriar escolhendo a chave certa

- **Não existe ~/.ssh/id_rsa**  
  Normal. Estamos usando `id_ed25519`

---

## 🧠 Boas práticas

- Usar uma única chave SSH pessoal
- Nunca misturar `.pem` com chaves do ~/.ssh
- Sempre saber qual chave foi usada na criação da VM
- Preferir `ssh ubuntu@IP` sem `-i`

---

📌 Status: procedimento validado  
📅 Última revisão: Dez/2025