import { config } from "./config";

export const getShapeByType = (type) => {
  if (config[type.toUpperCase()]) {
    return config[type.toUpperCase()].shape;
  }
  const info = Object.values(config).find(
    (typeInfo) => typeInfo.name.toUpperCase() === type.toUpperCase()
  );
  if (info) {
    return info.shape;
  }
  return "rectangle";
};

export const getColorByType = (type) => {
  if (config[type.toUpperCase()]) {
    return config[type.toUpperCase()].color;
  }
  const info = Object.values(config).find((typeInfo) => {
    return typeInfo.name.toUpperCase() === type.toUpperCase();
  });
  if (!info) {
    console.log(`Missing colour definition for ${type}`);
  }
  if (info) {
    return info.color;
  }
  return "black";
};
