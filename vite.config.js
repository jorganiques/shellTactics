export default defineConfig({
  base: '/shellTactics/',  // Add the correct base path here
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
