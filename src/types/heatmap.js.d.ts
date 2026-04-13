declare module "heatmap.js" {
  type HeatmapPoint = { x: number; y: number; value?: number };

  type HeatmapInstance = {
    setData: (data: { max: number; min: number; data: HeatmapPoint[] }) => void;
  };

  const heatmapFactory: {
    create: (config: Record<string, unknown>) => HeatmapInstance;
  };

  export default heatmapFactory;
}
