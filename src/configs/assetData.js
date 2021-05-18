//Hello PJ --- Note !!
//text param for text that placed after image
//caption param for text that placed below the image
//link param for button that placed below the image and it's href
export const videoTypes = {
  youtube: "youtube",
  vimeo: "vimeo",
  local: "local",
};
export const modeTypes = {
  fullScreen: "fullScreen",
  window: "window",
};
export const videoType3D = {
  threeD: "threeD",
};

const assetData = {
  step1: {
    "image0.jpg": {
      text: [],
      caption: "Cityscape, Shanghai",
      link: "",
      copyRight: "© Katherine Gu",
    },
    "image1.jpg": {
      text: [],
      caption: "Aerial view, Shanghai",
      link: "",
      copyRight: "© Ansonmaio",
    },
    "empty0.png": {
      text: ["Empower", "Tomorrow"],
      caption: "Huangpu River, Shanghai",
      link: "",
      copyRight: "© Derek Lee",
    },
  },
};
export default assetData;
