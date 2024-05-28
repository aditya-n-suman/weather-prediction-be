export const suggestionSet = {
  rain: { msg: 'Carry Umbrella', icon: '10d' },
  tooHot: { msg: 'Use sunscreen lotion', icon: '01d' },
  tooWindy: { msg: "It's too windy, watch out!", icon: '50d' },
  thunderStorm: { msg: "Don't step out! A Storm is brewing!", icon: '11d' },
};

export const tooWindyLimit = 10; // in mph
export const tooHotTemperature = 40; // in Celsius
//as per API specification
export const thunderstormIdRange = {
  min: 200,
  max: 299,
};
//as per API specification
export const rainIdRange = {
  min: 500,
  max: 599,
};
