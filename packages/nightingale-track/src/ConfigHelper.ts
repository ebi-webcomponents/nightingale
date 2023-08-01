import { config } from "./config";
type ConfigOption = keyof typeof config;

export const getShapeByType = (type: string) => {
  if (type.toUpperCase() in config) {
    return config[type.toUpperCase() as ConfigOption].shape;
  }
  const info = Object.values(config).find(
    (typeInfo) => typeInfo.name.toUpperCase() === type.toUpperCase(),
  );
  if (info) {
    return info.shape;
  }
  return "rectangle";
};

export const getColorByType = (type: string) => {
  if (type.toUpperCase() in config) {
    return config[type.toUpperCase() as ConfigOption].color;
  }
  const info = Object.values(config).find(
    (typeInfo) => typeInfo.name.toUpperCase() === type.toUpperCase(),
  );
  if (!info) {
    console.log(type);
  }
  if (info) {
    return info.color;
  }
  return "black";
};
