export default defineNuxtPlugin(async () => {
  const { initializeCart } = useCart();
  
  // Initialiser le panier au démarrage de l'application
  await initializeCart();
}); 