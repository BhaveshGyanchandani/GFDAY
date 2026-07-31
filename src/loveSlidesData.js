// ✏️ Every image path below is a placeholder — drop your real files into
// /public/assets/love/ using these names, or edit the paths to match yours.
//
// Slide shapes:
//  - { type: "text", image, text }            → normal slide, Back/Next
//  - { type: "text", image, text, autoAdvance: 3000 }  → same, but moves on
//    by itself after that many ms if she doesn't click anything
//  - { type: "text", image, paragraphs: [...] } → a longer multi-line slide
//  - { type: "decision", image, text, yesLabel, noLabel, noPopup }
//        → shows Yes/No instead of Back/Next. Yes just continues to the
//          next slide. No shows `noPopup` (image + text) for 3 seconds,
//          then continues to that same next slide.
//  - { type: "finale", image, eyebrow, text }  → last slide, no "Next"

const LOVE_SLIDES = [
  {
    type: "text",
    image: "/assets/love/1.jpg",
    text: "There were billion eyes, yet i choose your beautiful universe like vast eyes and as alcoholic as a wine to gaze, drink and swin in.",
  },
  {
    type: "text",
    image: "/assets/love/2.jpg",
    text: "There are so many hairs, yet i chose your beautiful curly ones to comb and play with.",
  },
  {
    type: "text",
    image: "/assets/love/3.jpg",
    text: "Billions of hands, yet yours are the one i would love to kiss the most, all time, each time everytime of any year, any day, any hour, any minute, any second.",
  },
  {
    type: "text",
    image: "/assets/love/4.jpg",
    text: "So many footprints yet i chose to follow yours",
  },
  {
    type: "text",
    image: "/assets/love/5.jpg",
    text: "So many ears, yet i want to whisper \"I love you\" in yours",
  },
  {
    type: "text",
    image: "/assets/love/6.jpg",
    text: "Wana kiss, bite grab your squeeshy fluffy cheeks yoo, soo fluffy and cutie cuteeee.",
  },
  {
    type: "decision",
    image: "/assets/love/decision-1.gif",
    text: "Are you ready to go on a roller coster ride with me, its gona be more roamtic or hehehehe 😁😁😁",
    yesLabel: "Yes (Be aware)",
    noLabel: "No (Dont want)",
    noPopup: {
      image: "/assets/love/no-1.gif",
      text: "Bleeeeeeeeh , i will say even if you dont wana listen duhhhhhh !!!!!!",
    },
  },
  {
    type: "text",
    image: "/assets/love/8.jpg",
    text: "I want to kiss the sweet white neck of yours.",
  },
  {
    type: "text",
    image: "/assets/love/9.jpg",
    text: "Your collarbone seems so nice, I might die seeing them.",
  },
  {
    type: "text",
    image: "/assets/love/10.jpg",
    text: "Your legs so fine, i want to surf on them.",
  },
  {
    type: "text",
    image: "/assets/love/11.jpg",
    text: "Your feet are pretty, all i wana kiss and follow them.",
  },
  {
    type: "text",
    image: "/assets/love/12.jpg",
    text: "so many waists and i want my hands to be around yours alone.",
  },
  {
    type: "text",
    image: "/assets/love/13.jpg",
    text: "So many back yet i want to massage and hold yours.",
  },
  {
    type: "text",
    image: "/assets/love/14.jpg",
    text: "Dont think of me as a pervert duhhhh !!!! Me no pervert hmph ........",
    autoAdvance: 3000,
  },
  {
    type: "decision",
    image: "/assets/love/decision-2.gif",
    text: "Are you ready with more deeper lovely texts.",
    yesLabel: "Yes",
    noLabel: "No",
    noPopup: {
      image: "/assets/love/no-2.gif",
      text: "BLEEEEEEEEH , You surely dont learn from past choices LOL !!!!! , I wont back down , I will convey all i want to.",
    },
  },
  {
    type: "text",
    image: "/assets/love/15.jpg",
    text: "Smile so adorable makes me crave for it more, want to make you as happy and smiley as ever.",
  },
  {
    type: "text",
    image: "/assets/love/16.jpg",
    text: "Want to feel your chest with mine (Hugging or ........) .",
  },
  {
    type: "text",
    image: "/assets/love/17.jpg",
    text: "So many bellies yet i want to kiss yours and sleep on them",
  },
  {
    type: "text",
    image: "/assets/love/18.jpg",
    text: "Want to sleep on your soft sweet squishy fluffy lap, would you let me, My baby.",
  },
  {
    type: "text",
    image: "/assets/love/19.jpg",
    text: "Want to kiss every single inch of your body, will you let me, My lady",
  },
  {
    type: "text",
    image: "/assets/love/20.jpg",
    text: "So many lips, yet i want to hold yours and kiss them.",
  },
  {
    type: "text",
    image: "/assets/love/21.jpg",
    text: "So many hearts, Yet i want only yours.",
  },
  {
    type: "text",
    image: "/assets/love/22.jpg",
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
    type: "finale",
    image: "/assets/love/finale.jpg",
    eyebrow: "At last, i wana ask...",
    text: "Will you be my odette Nuu, Can I be your lancelot.",
  },
];

export default LOVE_SLIDES;
