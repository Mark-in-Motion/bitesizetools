declare module "color-namer" {
    interface NamedColor {
      name: string;
      hex: string;
      distance: number;
    }
  
    interface Palettes {
      [palette: string]: NamedColor[];
    }
  
    interface ColorNamerOptions {
      pick?: string[];
      omit?: string[];
      distance?: "deltaE" | "euclidean";
    }
  
    function namer(
      color: string | string[],
      options?: ColorNamerOptions
    ): Palettes;
  
    export default namer;
  }
  