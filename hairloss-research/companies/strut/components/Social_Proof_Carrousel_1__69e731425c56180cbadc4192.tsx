import { useEffect, useRef } from "react";

const CARD_W = 260;
const GAP = 18;

function Card({ c, cardBg, pillColor, pillTextColor, nameColor, durationColor, benefitColor, benefitBg, nameFont, bodyFont }) {
  return (
    <div style={{
      width: CARD_W,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: cardBg,
      borderRadius: 20,
      overflow: "hidden",
      paddingBottom: 24,
    }}>
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{
          width: "100%",
          aspectRatio: "5 / 4",
          overflow: "hidden",
        }}>
          <img
            src={c.img}
            alt={c.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{
          position: "absolute",
          bottom: -16,
          left: "50%",
          transform: "translateX(-50%)",
          background: pillColor,
          color: pillTextColor,
          fontFamily: nameFont,
          fontSize: 14,
          fontWeight: 600,
          padding: "6px 20px",
          borderRadius: 50,
          whiteSpace: "nowrap",
        }}>
          Lost {c.lost} lbs
        </div>
      </div>
      <p style={{
        margin: "28px 0 4px",
        fontFamily: nameFont,
        fontSize: 22,
        fontWeight: 500,
        color: nameColor,
        textAlign: "center",
      }}>
        {c.name}
      </p>
      <p style={{
        margin: "0 0 14px",
        fontFamily: bodyFont,
        fontSize: 14,
        fontWeight: 400,
        color: durationColor,
        textAlign: "center",
      }}>
        {c.lost}lbs lost in {c.duration}
      </p>
      <div style={{
        fontFamily: bodyFont,
        fontSize: 13,
        fontWeight: 500,
        color: benefitColor,
        background: benefitBg,
        padding: "6px 16px",
        borderRadius: 50,
      }}>
        {c.benefit}
      </div>
    </div>
  );
}

export default function ResultsCarousel({
  cardBg = "#f7f7f5",
  pillColor = "#3ec9b0",
  pillTextColor = "#ffffff",
  nameColor = "#1a1a1a",
  durationColor = "#777777",
  benefitColor = "#555555",
  benefitBg = "#edede9",
  nameFont = "'DM Sans', -apple-system, sans-serif",
  bodyFont = "'DM Sans', -apple-system, sans-serif",
  speed = 0.5,
  card1Name = "Angie F.",
  card1Lost = "42",
  card1Duration = "4 months",
  card1Benefit = "Improved Cognition",
  card1Img = "https://koramd.com/cdn/shop/files/Image-_1.png?v=1772004550&width=600",
  card2Name = "Michelle R.",
  card2Lost = "38",
  card2Duration = "5 months",
  card2Benefit = "70% Less cravings",
  card2Img = "https://koramd.com/cdn/shop/files/k.png?v=1772003337&width=600",
  card3Name = "Sarah F.",
  card3Lost = "82",
  card3Duration = "7 months",
  card3Benefit = "Increased deep sleep",
  card3Img = "https://koramd.com/cdn/shop/files/Image_7.png?v=1772004410&width=600",
  card4Name = "David M.",
  card4Lost = "20",
  card4Duration = "3 months",
  card4Benefit = "17% increased muscle",
  card4Img = "https://koramd.com/cdn/shop/files/3_2986e7f8-887f-4e0f-b195-4d2a85d6bf90.png?v=1772004299&width=600",
  card5Name = "Sandra K.",
  card5Lost = "42",
  card5Duration = "4 months",
  card5Benefit = "65% less cravings",
  card5Img = "https://koramd.com/cdn/shop/files/Image_5.png?v=1772004235&width=600",
}) {
  const scrollRef = useRef(null);

  const cards = [
    { name: card1Name, lost: card1Lost, duration: card1Duration, benefit: card1Benefit, img: card1Img },
    { name: card2Name, lost: card2Lost, duration: card2Duration, benefit: card2Benefit, img: card2Img },
    { name: card3Name, lost: card3Lost, duration: card3Duration, benefit: card3Benefit, img: card3Img },
    { name: card4Name, lost: card4Lost, duration: card4Duration, benefit: card4Benefit, img: card4Img },
    { name: card5Name, lost: card5Lost, duration: card5Duration, benefit: card5Benefit, img: card5Img },
  ].filter(c => c.name && c.img);

  const setW = cards.length * (CARD_W + GAP);
  const allCards = [...cards, ...cards, ...cards, ...cards];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf;
    let pos = 0;
    const tick = () => {
      pos += speed;
      if (pos >= setW) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, setW]);

  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "8px 0" }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: GAP,
          willChange: "transform",
        }}
      >
        {allCards.map((c, i) => (
          <Card
            key={i}
            c={c}
            cardBg={cardBg}
            pillColor={pillColor}
            pillTextColor={pillTextColor}
            nameColor={nameColor}
            durationColor={durationColor}
            benefitColor={benefitColor}
            benefitBg={benefitBg}
            nameFont={nameFont}
            bodyFont={bodyFont}
          />
        ))}
      </div>
    </div>
  );
}

export const propSchema = {
  cardBg: {
    type: 'color',
    title: 'Card Background',
    defaultValue: '#f7f7f5',
  },
  pillColor: {
    type: 'color',
    title: 'Pill Badge Color',
    defaultValue: '#3ec9b0',
  },
  pillTextColor: {
    type: 'color',
    title: 'Pill Text Color',
    defaultValue: '#ffffff',
  },
  nameColor: {
    type: 'color',
    title: 'Name Color',
    defaultValue: '#1a1a1a',
  },
  durationColor: {
    type: 'color',
    title: 'Duration Text Color',
    defaultValue: '#777777',
  },
  benefitColor: {
    type: 'color',
    title: 'Benefit Tag Text',
    defaultValue: '#555555',
  },
  benefitBg: {
    type: 'color',
    title: 'Benefit Tag Background',
    defaultValue: '#edede9',
  },
  nameFont: {
    type: 'string',
    title: 'Name Font',
    defaultValue: "'DM Sans', -apple-system, sans-serif",
  },
  bodyFont: {
    type: 'string',
    title: 'Body Font',
    defaultValue: "'DM Sans', -apple-system, sans-serif",
  },
  speed: {
    type: 'number',
    title: 'Scroll Speed (px/frame)',
    defaultValue: 0.5,
    min: 0.1,
    max: 2,
    step: 0.05,
  },
  card1Name: { type: 'string', title: 'Card 1 Name', defaultValue: 'Angie F.' },
  card1Lost: { type: 'string', title: 'Card 1 Lbs Lost', defaultValue: '42' },
  card1Duration: { type: 'string', title: 'Card 1 Duration', defaultValue: '4 months' },
  card1Benefit: { type: 'string', title: 'Card 1 Benefit', defaultValue: 'Improved Cognition' },
  card1Img: { type: 'string', title: 'Card 1 Image URL', defaultValue: 'https://koramd.com/cdn/shop/files/Image-_1.png?v=1772004550&width=600' },
  card2Name: { type: 'string', title: 'Card 2 Name', defaultValue: 'Michelle R.' },
  card2Lost: { type: 'string', title: 'Card 2 Lbs Lost', defaultValue: '38' },
  card2Duration: { type: 'string', title: 'Card 2 Duration', defaultValue: '5 months' },
  card2Benefit: { type: 'string', title: 'Card 2 Benefit', defaultValue: '70% Less cravings' },
  card2Img: { type: 'string', title: 'Card 2 Image URL', defaultValue: 'https://koramd.com/cdn/shop/files/k.png?v=1772003337&width=600' },
  card3Name: { type: 'string', title: 'Card 3 Name', defaultValue: 'Sarah F.' },
  card3Lost: { type: 'string', title: 'Card 3 Lbs Lost', defaultValue: '82' },
  card3Duration: { type: 'string', title: 'Card 3 Duration', defaultValue: '7 months' },
  card3Benefit: { type: 'string', title: 'Card 3 Benefit', defaultValue: 'Increased deep sleep' },
  card3Img: { type: 'string', title: 'Card 3 Image URL', defaultValue: 'https://koramd.com/cdn/shop/files/Image_7.png?v=1772004410&width=600' },
  card4Name: { type: 'string', title: 'Card 4 Name', defaultValue: 'David M.' },
  card4Lost: { type: 'string', title: 'Card 4 Lbs Lost', defaultValue: '20' },
  card4Duration: { type: 'string', title: 'Card 4 Duration', defaultValue: '3 months' },
  card4Benefit: { type: 'string', title: 'Card 4 Benefit', defaultValue: '17% increased muscle' },
  card4Img: { type: 'string', title: 'Card 4 Image URL', defaultValue: 'https://koramd.com/cdn/shop/files/3_2986e7f8-887f-4e0f-b195-4d2a85d6bf90.png?v=1772004299&width=600' },
  card5Name: { type: 'string', title: 'Card 5 Name', defaultValue: 'Sandra K.' },
  card5Lost: { type: 'string', title: 'Card 5 Lbs Lost', defaultValue: '42' },
  card5Duration: { type: 'string', title: 'Card 5 Duration', defaultValue: '4 months' },
  card5Benefit: { type: 'string', title: 'Card 5 Benefit', defaultValue: '65% less cravings' },
  card5Img: { type: 'string', title: 'Card 5 Image URL', defaultValue: 'https://koramd.com/cdn/shop/files/Image_5.png?v=1772004235&width=600' },
};