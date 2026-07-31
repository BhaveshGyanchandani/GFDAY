// All images mapped from /public/assets/Nuu/
// Slides with noImageMsg show a cute custom message instead of a broken image.
//
// Slide shapes:
//  - { type: "text", image, text }
//  - { type: "text", image, text, autoAdvance: 3000 }
//  - { type: "text", image, paragraphs: [...] }
//  - { type: "text", noImageMsg, text }           → no real image, shows msg
//  - { type: "decision", image, text, yesLabel, noLabel, noPopup }
//  - { type: "finale", image, eyebrow, text }

const LOVE_SLIDES = [
  {
    // 1 — eyes ✅
    type: "text",
    image: "/assets/Nuu/eyes.jpg",
    text: "There were billion eyes, yet i choose your beautiful universe like vast eyes and as alcoholic as a wine to gaze, drink and swin in.",
  },
  {
    // 2 — hair ✅
    type: "text",
    image: "/assets/Nuu/hair.jpg",
    text: "There are so many hairs, yet i chose your beautiful curly ones to comb and play with.",
  },
  {
    // 3 — hand ✅
    type: "text",
    image: "/assets/Nuu/hand.jpg",
    text: "Billions of hands, yet yours are the one i would love to kiss the most, all time, each time everytime of any year, any day, any hour, any minute, any second.",
  },
  {
    // 4 — footprints ✅
    type: "text",
    image: "/assets/Nuu/footprints.jpg",
    text: "So many footprints yet i chose to follow yours",
  },
  {
    // 5 — ears ✅
    type: "text",
    image: "/assets/Nuu/ears.jpeg",
    text: "So many ears, yet i want to whisper \"I love you\" in yours",
  },
  {
    // 6 — cheeks ✅
    type: "text",
    image: "/assets/Nuu/cheeks.jpg",
    text: "Wana kiss, bite grab your squeeshy fluffy cheeks yoo, soo fluffy and cutie cuteeee.",
  },
  {
    // decision 1 — rollercoaster ✅
    type: "decision",
    image: "/assets/Nuu/rollercoaster.jpg",
    text: "Are you ready to go on a roller coster ride with me, its gona be more roamtic or hehehehe 😁😁😁",
    yesLabel: "Yes (Be aware)",
    noLabel: "No (Dont want)",
    noPopup: {
      image: "/assets/Nuu/bleeh_1.jpg",
      text: "Bleeeeeeeeh , i will say even if you dont wana listen duhhhhhh !!!!!!",
    },
  },
  {
    // 8 — neck ✅
    type: "text",
    image: "/assets/Nuu/neck.jpg",
    text: "I want to kiss the sweet white neck of yours.",
  },
  {
    // 9 — collarbone ✅
    type: "text",
    image: "/assets/Nuu/collarbone.jpeg",
    text: "Your collarbone seems so nice, I might die seeing them.",
  },
  {
    // 10 — legs ✅
    type: "text",
    image: "/assets/Nuu/legs.jpg",
    text: "Your legs so fine, i want to surf on them.",
  },
  {
    // 11 — feet ✅
    type: "text",
    image: "/assets/Nuu/feet.jpg",
    text: "Your feet are pretty, all i wana kiss and follow them.",
  },
  {
    // 12 — waist ✅
    type: "text",
    image: "/assets/Nuu/waist.jpg",
    text: "so many waists and i want my hands to be around yours alone.",
  },
  {
    // 13 — back ✅
    type: "text",
    image: "/assets/Nuu/back.jpg",
    text: "So many back yet i want to massage and hold yours.",
  },
  {
    // 14 — butt ✅ + hmph reaction
    type: "text",
    image: "/assets/Nuu/butt.jpg",
    text: "Dont think of me as a pervert duhhhh !!!! Me no pervert hmph ........",
    autoAdvance: 3000,
  },
  {
    // decision 2 — hehe ✅
    type: "decision",
    image: "/assets/Nuu/hehe.jpg",
    text: "Are you ready with more deeper lovely texts.",
    yesLabel: "Yes",
    noLabel: "No",
    noPopup: {
      image: "/assets/Nuu/bleeh_2.jpg",
      text: "BLEEEEEEEEH , You surely dont learn from past choices LOL !!!!! , I wont back down , I will convey all i want to.",
    },
  },
  {
    // 15 — smile ✅
    type: "text",
    image: "/assets/Nuu/smile.png",
    text: "Smile so adorable makes me crave for it more, want to make you as happy and smiley as ever.",
  },
  {
    // 16 — chest/boobies ✅
    type: "text",
    image: "/assets/Nuu/boobies.jpg",
    text: "Want to feel your chest with mine (Hugging or ........) .",
  },
  {
    // 17 — belly ❌ no pic — show sweet message
    type: "text",
    image: null,
    noImageMsg: "I dont have your belly pics tho 😥😥😥",
    text: "So many bellies yet i want to kiss yours and sleep on them",
  },
  {
    // 18 — lap ✅
    type: "text",
    image: "/assets/Nuu/lap.jpg",
    text: "Want to sleep on your soft sweet squishy fluffy lap, would you let me, My baby.",
  },
  {
    // 19 — full body kiss ✅
    type: "text",
    image: "/assets/Nuu/kiss.jpg",
    text: "Want to kiss every single inch of your body, will you let me, My lady",
  },
  {
    // 20 — lips ✅
    type: "text",
    image: "/assets/Nuu/lips.jpeg",
    text: "So many lips, yet i want to hold yours and kiss them.",
  },
  {
    // 21 — love/heart ✅
    type: "text",
    image: "/assets/Nuu/love.jpg",
    text: "So many hearts, Yet i want only yours.",
  },
  {
    // 22 — final love note ✅ hehe.jpg
    type: "text",
    image: "/assets/Nuu/hehe.jpg",
    paragraphs: [
      "I know i am a pervert kind of guy, But I am who I am, and Whoever I am, Am yours,",
      "I am pervy only for you my princess",
      "I am weird only for you my Lady",
      "I am H*rny only for you My dear ( wait not that kind of h*orny yoooo, 24x7 waala niii )",
      "I am stalker only for you my baby",
      "I am your personal periods day reminder my Baby girl",
      "I am everything for you, only for you nuu ♥.",
      "",
      "You were never a option for me, you are the choice i have made, and i hope I am the choice you have made.",
      "Living together, fighting together, resolving together, loving together.",
      "whatever we gona do, we do together okie baby.",
    ],
  },
  {
    // finale — odette & lancelot ✅
    type: "finale",
    image: "/assets/Nuu/odette_and_lancelot.jpg",
    eyebrow: "At last, i wana ask...",
    text: "Will you be my odette Nuu, Can I be your lancelot.",
  },
];

export default LOVE_SLIDES;
