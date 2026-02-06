// Importar estilos globais
import '@styles/global.css';
import { atualizarInterfaceUsuario } from './scripts/main';
// Inicializar aplicação
console.log('Aplicação carregada!');

// Aqui você pode adicionar scripts globais que funcionam em todas as páginas
// Por exemplo: event listeners, inicialização de componentes, etc.
atualizarInterfaceUsuario();
// Exemplo: listener para links de navegação
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado - pronto para interações');
  
  // Seu código aqui
});
