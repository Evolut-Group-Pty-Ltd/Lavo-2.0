//Hello  --- Note !!
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
    "hyd.png": {
      text: ["Its fuel has taken us to","the moon."],
      caption: "",
      link: "",
      copyRight: "",
    },
    "globe2.png": {
      text: ["Hydrogen is the most","abundant element in the","universe."],
      caption: "",
      link: "",
      copyRight: "",
    },
    "globe1.png": {
      text: ["Here on Earth, it doesn't", "appear pure in nature."],
      caption: "more info here",
      link: "",
      copyRight: "",
    },
  },
};
export default assetData;
