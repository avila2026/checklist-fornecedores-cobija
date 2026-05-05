# 🛍️ Checklist de Fornecedores - Cobija, Bolivia

Mini app React para gerenciar e verificar fornecedores de perfumes, cosméticos e produtos importados em Cobija, Bolivia.

## 🎯 Funcionalidades

- **Checklist interativo** - 8 itens de verificação por fornecedor (contatado, catálogo, preço, fotos, marcas, originalidade, visita, compra)
- **Edição completa** - Edite todos os dados: nome, contato, tipo, endereço, prioridade, atacado, status
- **Customização de checks** - Adicione, remova ou renomeie os itens de verificação
- **Mensagem WhatsApp** - Template personalizável para contato direto
- **Integração com Maps** - Links diretos para localizar as lojas no Google Maps
- **Busca e filtros** - Por nome, tipo, endereço, prioridade, status
- **Persistência de dados** - Tudo salvo automaticamente no localStorage
- **Exportar JSON** - Faça backup dos seus dados
- **Novo cadastro** - Adicione fornecedores personalizados

## 🚀 Tecnologias

- **React 18** - UI interativa
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Vite** - Build tool
- **localStorage** - Persistência de dados

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/checklist-fornecedores-cobija.git
cd checklist-fornecedores-cobija

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎨 Estrutura do projeto

```
.
├── index.html              # Arquivo HTML principal
├── package.json            # Dependências e scripts
├── vite.config.js          # Configuração Vite
├── tailwind.config.js      # Configuração Tailwind
├── postcss.config.js       # Configuração PostCSS
└── src/
    ├── main.jsx            # Ponto de entrada React
    ├── App.jsx             # Componente principal
    └── index.css           # Estilos globais
```

## 📋 Guia de Uso

### Dashboard
- Visualize estatísticas: Total, Aprovados, Verificados, Em Andamento, Pendentes
- Barra de progresso mostra o avanço de verificação

### Adicionar Fornecedor
1. Clique em "+ Novo fornecedor"
2. Preencha os dados
3. Clique em "Adicionar"

### Editar Fornecedor
1. Clique no ícone ✏️ ao lado de um fornecedor
2. Edite os campos que desejar
3. Clique em "Salvar" ou "Cancelar"

### Gerenciar Checks
1. Clique no ícone ⚙️ no topo
2. Renomeie, adicione ou remova itens de verificação
3. Adicione novos checks personalizados

### Customizar Mensagem WhatsApp
1. Clique em "Mensagem WhatsApp"
2. Clique em "✏️ Editar"
3. Modifique a mensagem conforme necessário
4. Use "Copiar" para copiar para a área de transferência

### Verificar Fornecedor
1. Clique em "Verificação (x/y)" para expandir os checks
2. Clique em cada item para marcar como verificado
3. Adicione notas pessoais no campo de texto

### Contato
- **Telefone**: Abre WhatsApp com a mensagem pronta
- **Endereço**: Abre Google Maps com a localização

### Exportar Dados
- Clique em "Exportar" para baixar um arquivo JSON com todos os dados

## 💾 Dados Persistidos

Os dados são salvos automaticamente no localStorage do navegador:
- Lista de fornecedores
- Status de verificação
- Itens de checklist personalizados
- Mensagem WhatsApp editada
- Notas pessoais

## 🔒 Segurança

- Os dados são armazenados localmente no seu navegador
- Nenhum dado é enviado para servidores externos
- Use "Exportar" para fazer backup dos seus dados

## 📝 Dados Iniciais

O app vem pré-carregado com 10 fornecedores da lista inicial de Cobija:
1. Perfumeria Bolivia Shop
2. La Bodega de Mena
3. Perfumes Europeos
4. NuevoMundo Cobija
5. AcreCorp
6. Diana Perfumeria
7. Punto Yanbal, Esika, L'Bel y Cyzone
8. Yanbal - Lourdes Sobrino Pereira
9. Pink and Pink
10. Importaciones Anita

## 📱 Responsivo

O app é totalmente responsivo e funciona em:
- Desktop (Chrome, Firefox, Safari, Edge)
- Tablet
- Mobile

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👤 Autor

Criado para AVILA - Fornecedores em Cobija

## 📞 Contato

Para dúvidas ou sugestões sobre o app, entre em contato:
- **Email**: avilamix.ac@outlook.com
- **WhatsApp**: (68) 98104-1177

---

Made with ❤️ for better supplier management
