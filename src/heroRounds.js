// Game rounds for "Play a Game" — guess who's the best!
// Each reveal.image now points to the real photo in /assets/guess/

const HERO_ROUNDS = [
  {
    heading: "Who is more cuter?",
    optionA: { label: "Nana", image: "/assets/guess/nana.jpg" },
    optionB: { label: "Chang'e", image: "/assets/guess/change.jpg" },
    reveal: {
      image: "/assets/guess/cutest.jpg",
      text: "Naaaah !!!!! Absolutely wrong , My Nuu is most cutest of them All.",
    },
  },
  {
    heading: "Who is more pretty?",
    optionA: { label: "Kagura", image: "/assets/guess/kagura.jpg" },
    optionB: { label: "Guinevere", image: "/assets/guess/guinevere.jpg" },
    reveal: {
      image: "/assets/guess/prettiest.jpg",
      text: "Nuh-uh! Wrong answer, my Nuu is the prettiest one there ever was.",
    },
  },
  {
    heading: "Who is more beautiful?",
    optionA: { label: "Lunox", image: "/assets/guess/lunox.jpg" },
    optionB: { label: "Odette", image: "/assets/guess/odette.jpg" },
    reveal: {
      image: "/assets/guess/beautiful.jpg",
      text: "Nope! Try again, my Nuu is the most beautiful, hands down.",
    },
  },
  {
    heading: "Who is more gorgeous?",
    optionA: { label: "Carmillia", image: "/assets/guess/carmillia.jpg" },
    optionB: { label: "Zetian", image: "/assets/guess/zetian.jpg" },
    reveal: {
      image: "/assets/guess/gorgeous.jpeg",
      text: "Wrongggg! My Nuu is the most gorgeous, no contest at all.",
    },
  },
  {
    heading: "Who is more caring?",
    optionA: { label: "Rafaela", image: "/assets/guess/rafaela.jpg" },
    optionB: { label: "Floryn", image: "/assets/guess/floryn.jpg" },
    reveal: {
      image: "/assets/guess/caring.jpg",
      text: "Nuuuh-uh! Nobody cares like my Nuu does.",
    },
  },
  {
    heading: "Who is the best supporter?",
    optionA: { label: "Angela", image: "/assets/guess/angela.jpg" },
    optionB: { label: "Mathilda", image: "/assets/guess/mathilda.jpg" },
    reveal: {
      image: "/assets/guess/supporter.jpg",
      text: "Incorrect! My Nuu is the realest MVP supporter of them all.",
    },
  },
  {
    heading: "Who is the best baddie?",
    optionA: { label: "Selena", image: "/assets/guess/selena.jpg" },
    optionB: { label: "Alice", image: "/assets/guess/alice.jpg" },
    reveal: {
      image: "/assets/guess/baddie.jpg",
      text: "Nooo way! My Nuu is the ultimate baddie, period.",
    },
  },
  {
    heading: "Who is the sweetest?",
    optionA: { label: "Miya", image: "/assets/guess/miya.jpg" },
    optionB: { label: "Layla", image: "/assets/guess/layla.jpg" },
    reveal: {
      image: "/assets/guess/sweetest.jpeg",
      text: "Wrong again! My Nuu is the sweetest soul I know.",
    },
  },
];

export default HERO_ROUNDS;