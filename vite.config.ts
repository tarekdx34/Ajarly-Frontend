import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "vaul@1.1.2": "vaul",
      "sonner@2.0.3": "sonner",
      "recharts@2.15.2": "recharts",
      "react-resizable-panels@2.1.7": "react-resizable-panels",
      "react-hook-form@7.55.0": "react-hook-form",
      "react-day-picker@8.10.1": "react-day-picker",
      "next-themes@0.4.6": "next-themes",
      "lucide-react@0.487.0": "lucide-react",
      "input-otp@1.4.2": "input-otp",
      "figma:asset/f00c34002d1d7eca40eb32cfff0243c366367f65.png": path.resolve(
        __dirname,
        "./src/assets/f00c34002d1d7eca40eb32cfff0243c366367f65.png"
      ),
      "figma:asset/e67bb1a0f982a12a783978829e2970686f14ee38.png": path.resolve(
        __dirname,
        "./src/assets/e67bb1a0f982a12a783978829e2970686f14ee38.png"
      ),
      "figma:asset/e079fdddddd7be7201c3a5e92528b315b9fa0971.png": path.resolve(
        __dirname,
        "./src/assets/e079fdddddd7be7201c3a5e92528b315b9fa0971.png"
      ),
      "figma:asset/d03969b6ca690ffca0a4b57057de938f36ecb095.png": path.resolve(
        __dirname,
        "./src/assets/d03969b6ca690ffca0a4b57057de938f36ecb095.png"
      ),
      "figma:asset/b455c6c418c1542012aaca2b288655df51bc4688.png": path.resolve(
        __dirname,
        "./src/assets/b455c6c418c1542012aaca2b288655df51bc4688.png"
      ),
      "figma:asset/b3be645ffe0986cffe452835c116959b40fdb706.png": path.resolve(
        __dirname,
        "./src/assets/b3be645ffe0986cffe452835c116959b40fdb706.png"
      ),
      "figma:asset/a0c7245eae26dd5493c9ceddced10eef2e29745b.png": path.resolve(
        __dirname,
        "./src/assets/a0c7245eae26dd5493c9ceddced10eef2e29745b.png"
      ),
      "figma:asset/811fd5b9c9e7f488da238cf0c246a1f6ddf843c6.png": path.resolve(
        __dirname,
        "./src/assets/811fd5b9c9e7f488da238cf0c246a1f6ddf843c6.png"
      ),
      "figma:asset/6981122e32b569baa48b015556f6a97594a629d4.png": path.resolve(
        __dirname,
        "./src/assets/6981122e32b569baa48b015556f6a97594a629d4.png"
      ),
      "figma:asset/4f2d61656e4b5a22619b18ac6c98dbc40687b435.png": path.resolve(
        __dirname,
        "./src/assets/4f2d61656e4b5a22619b18ac6c98dbc40687b435.png"
      ),
      "figma:asset/49d4b8dee58996e6e85d8ecb57d08d9757776b4d.png": path.resolve(
        __dirname,
        "./src/assets/49d4b8dee58996e6e85d8ecb57d08d9757776b4d.png"
      ),
      "figma:asset/36a8387bce6e73ed67b6457dc9e1713202195a27.png": path.resolve(
        __dirname,
        "./src/assets/36a8387bce6e73ed67b6457dc9e1713202195a27.png"
      ),
      "figma:asset/2e32faa9a2965e18c7d776437c1b206d17cf9bda.png": path.resolve(
        __dirname,
        "./src/assets/2e32faa9a2965e18c7d776437c1b206d17cf9bda.png"
      ),
      "figma:asset/0037552dbef43f7327187959f8188c43490c5084.png": path.resolve(
        __dirname,
        "./src/assets/0037552dbef43f7327187959f8188c43490c5084.png"
      ),
      "embla-carousel-react@8.6.0": "embla-carousel-react",
      "cmdk@1.1.1": "cmdk",
      "class-variance-authority@0.7.1": "class-variance-authority",
      "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
      "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
      "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
      "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
      "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
      "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
      "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
      "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
      "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
      "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
      "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
      "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
      "@radix-ui/react-navigation-menu@1.2.5":
        "@radix-ui/react-navigation-menu",
      "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
      "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
      "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
      "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
      "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
      "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
      "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
      "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
      "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
      "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "build",
  },
  server: {
    port: 3355,
    open: true,
  },
});
