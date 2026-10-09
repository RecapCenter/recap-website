import { cn } from "@/lib/utils";
import {
  Band,
  Bird,
  Boat,
  Corner,
  GoldLine,
  Grain,
  HeroDefs,
  Perspective,
  Seal,
  Spiral,
  Swoop,
  Tagline,
  WASH,
  Wash,
} from "./hero-elements";

/*
 * The three hero compositions. Each one's viewBox matches the aspect ratio
 * of the banner artwork it replaced (16:9 laptop, ~1.1:1 tablet, 2:3
 * phone), and coordinates are in that artwork's pixels, so positions can be
 * compared 1:1 against the original designs. The top corners are left
 * empty on purpose — the fixed navbar's logo and menu sit there.
 */

type LayoutProps = { className?: string };

/**
 * Three stacked SVGs sharing one viewBox, split by how often each repaints —
 * WebKit (every iOS browser) repaints a whole SVG whenever anything inside
 * it changes:
 *
 * - `art` (washes, waves, grain — all filtered) is static and fades in as a
 *   single layer, so its expensive filters render once.
 * - `motion` (lines, seal, text) only animates during the ~4s intro, then
 *   never repaints again.
 * - `loop` (boat, birds) animates forever. It holds nothing else, so each
 *   frame repaints a few small shapes instead of the seal's curved text, the
 *   R mark and the tagline. It sits on top, as the boat and birds did when
 *   they shared the motion layer; nothing in it overlaps the text.
 *
 * See the note at the top of hero-elements.tsx.
 */
function HeroFrame({
  w,
  h,
  className,
  art,
  motion,
  loop,
}: {
  w: number;
  h: number;
  className?: string;
  art: React.ReactNode;
  motion: React.ReactNode;
  loop: React.ReactNode;
}) {
  const viewBox = `0 0 ${w} ${h}`;
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={viewBox}
        className="hero-art block h-auto w-full"
        aria-hidden
        focusable="false"
      >
        {art}
      </svg>
      <svg
        viewBox={viewBox}
        className="absolute inset-0 h-full w-full"
        aria-hidden
        focusable="false"
      >
        {motion}
      </svg>
      <svg
        viewBox={viewBox}
        className="hero-loop absolute inset-0 h-full w-full"
        aria-hidden
        focusable="false"
      >
        {loop}
      </svg>
    </div>
  );
}

export function LaptopHero({ className }: LayoutProps) {
  const p = "hero-l";
  const [w, h] = [1672, 941];
  return (
    <HeroFrame
      w={w}
      h={h}
      className={className}
      art={
        <>
          <HeroDefs p={p} w={w} h={h} />
          <Wash
            p={p}
            cx={120}
            cy={190}
            rx={215}
            ry={250}
            color="pink"
            seed={11}
            opacity={0.8}
            rot={0.3}
          />
          <Wash
            p={p}
            cx={1510}
            cy={130}
            rx={190}
            ry={160}
            color="blue"
            seed={5}
            opacity={0.8}
          />
          <Wash
            p={p}
            cx={1540}
            cy={460}
            rx={175}
            ry={215}
            color="pink"
            seed={21}
            opacity={0.7}
            rot={0.8}
          />
          <Swoop
            p={p}
            d="M0,520 C80,520 150,600 172,700 L150,941 L0,941 Z"
            color={WASH.beige}
            opacity={0.5}
          />
          <Swoop
            p={p}
            d="M0,700 C120,688 220,716 330,776 C430,832 560,900 700,941 L0,941 Z"
            color={WASH.blue}
            opacity={0.6}
          />
          <Swoop
            p={p}
            d="M0,800 C200,790 420,862 620,852 C820,842 1000,800 1200,818 C1300,828 1352,880 1400,941 L0,941 Z"
            color={WASH.peach}
            opacity={0.42}
          />
          <Swoop
            p={p}
            d="M300,941 C500,880 700,862 900,880 C1050,894 1150,920 1220,941 Z"
            color={WASH.sky}
            opacity={0.6}
          />
          <Swoop
            p={p}
            d="M1080,941 C1240,860 1400,700 1672,570 L1672,941 Z"
            color={WASH.sage}
            opacity={0.65}
          />
          <path
            d="M0,760 C150,770 250,840 330,941"
            fill="none"
            stroke="#9fb3c6"
            strokeWidth={1.5}
          />
          <Grain p={p} w={w} h={h} />
        </>
      }
      motion={
        <>
          <GoldLine
            index={0}
            d="M0,42 C40,48 58,110 84,180 C110,250 180,286 206,322 C216,338 200,350 206,362 C212,372 218,378 210,388 C202,396 214,404 212,414 C210,424 226,430 232,446 C240,466 226,476 196,486 C150,502 112,560 128,626 C144,690 214,736 330,764 C400,780 470,772 540,770 C640,768 740,820 860,941"
          />
          <GoldLine
            index={1}
            d="M0,468 C80,462 132,490 150,548 C170,610 210,680 300,722"
          />
          <GoldLine
            index={2}
            d="M1268,0 C1300,70 1356,170 1440,222 C1520,272 1610,272 1672,262"
          />
          <GoldLine
            index={3}
            d="M1672,622 C1520,648 1390,700 1300,780 C1230,842 1160,900 1100,941"
          />
          <Spiral
            cx={1500}
            cy={468}
            r0={78}
            turns={2.3}
            tail="M1672,420 C1620,380 1560,380 1530,395"
          />
          <Seal p={p} cx={830} cy={360} r={225} />
          <Tagline
            x={836}
            y={642}
            size={40}
            lines={[
              <>
                From managing chaos to developing <Perspective />
              </>,
            ]}
            brushX={1024}
            brushY={676}
            brushW={236}
          />
          <Corner
            x={1420}
            y={770}
            lines={["A SAFE SPACE", "FOR REAL", "CHANGE"]}
            size={20}
            gap={34}
          />
        </>
      }
      loop={
        <>
          <Boat x={380} y={708} s={1.25} />
          <Bird index={0} x={1112} y={196} s={1.15} rot={12} />
          <Bird index={1} x={1184} y={182} s={0.9} rot={-8} />
          <Bird index={2} x={1178} y={250} s={0.8} rot={20} />
        </>
      }
    />
  );
}

export function TabletHero({ className }: LayoutProps) {
  const p = "hero-t";
  const [w, h] = [1317, 1194];
  return (
    <HeroFrame
      w={w}
      h={h}
      className={className}
      art={
        <>
          <HeroDefs p={p} w={w} h={h} />
          <Wash
            p={p}
            cx={120}
            cy={250}
            rx={210}
            ry={300}
            color="pink"
            seed={11}
            opacity={0.8}
            rot={0.3}
          />
          <Wash
            p={p}
            cx={1175}
            cy={160}
            rx={180}
            ry={175}
            color="blue"
            seed={5}
            opacity={0.8}
          />
          <Wash
            p={p}
            cx={1215}
            cy={540}
            rx={160}
            ry={240}
            color="pink"
            seed={21}
            opacity={0.7}
            rot={0.8}
          />
          <Swoop
            p={p}
            d="M0,700 C90,700 170,800 182,900 L160,1194 L0,1194 Z"
            color={WASH.beige}
            opacity={0.5}
          />
          <Swoop
            p={p}
            d="M0,860 C130,850 240,890 360,950 C470,1010 600,1090 760,1194 L0,1194 Z"
            color={WASH.blue}
            opacity={0.6}
          />
          <Swoop
            p={p}
            d="M0,960 C220,950 460,1030 680,1020 C880,1010 1060,970 1317,1000 L1317,1194 L0,1194 Z"
            color={WASH.peach}
            opacity={0.38}
          />
          <Swoop
            p={p}
            d="M300,1194 C520,1120 760,1100 1000,1130 C1100,1145 1200,1170 1250,1194 Z"
            color={WASH.sky}
            opacity={0.6}
          />
          <Swoop
            p={p}
            d="M880,1194 C1000,1100 1140,860 1317,720 L1317,1194 Z"
            color={WASH.sage}
            opacity={0.65}
          />
          <path
            d="M0,946 C150,956 260,1040 330,1194"
            fill="none"
            stroke="#9fb3c6"
            strokeWidth={1.5}
          />
          <Grain p={p} w={w} h={h} />
        </>
      }
      motion={
        <>
          <GoldLine
            index={0}
            d="M0,108 C40,120 56,200 80,280 C102,350 160,396 182,432 C192,448 176,462 184,476 C192,488 196,494 188,506 C180,514 192,522 190,534 C188,546 206,552 210,568 C214,588 190,596 160,606 C110,626 80,700 96,780 C112,860 190,910 330,936 C420,952 520,930 600,948 C700,970 760,1060 820,1100 C900,1150 1060,1050 1317,818"
          />
          <GoldLine
            index={1}
            d="M0,578 C70,574 120,610 132,680 C146,760 200,840 300,880"
          />
          <GoldLine
            index={2}
            d="M958,0 C980,90 1040,220 1140,290 C1210,330 1270,326 1317,322"
          />
          <Spiral
            cx={1185}
            cy={578}
            r0={72}
            turns={2.3}
            tail="M1317,470 C1260,440 1210,470 1195,500"
          />
          <Seal p={p} cx={660} cy={482} r={226} />
          <Tagline
            x={662}
            y={770}
            size={38}
            lines={[
              <>
                From managing chaos to developing <Perspective />
              </>,
            ]}
            brushX={842}
            brushY={804}
            brushW={232}
          />
          <Corner
            x={1060}
            y={968}
            lines={["A SAFE SPACE", "FOR REAL", "CHANGE"]}
            size={21}
            gap={36}
          />
        </>
      }
      loop={
        <>
          <Boat x={306} y={882} s={1.12} />
          <Bird index={0} x={880} y={262} s={1.15} rot={12} />
          <Bird index={1} x={952} y={248} s={0.9} rot={-8} />
          <Bird index={2} x={946} y={316} s={0.8} rot={20} />
        </>
      }
    />
  );
}

export function PhoneHero({ className }: LayoutProps) {
  const p = "hero-p";
  const [w, h] = [1024, 1536];
  return (
    <HeroFrame
      w={w}
      h={h}
      className={className}
      art={
        <>
          <HeroDefs p={p} w={w} h={h} />
          <Wash
            p={p}
            cx={120}
            cy={170}
            rx={200}
            ry={220}
            color="blue"
            seed={5}
            opacity={0.6}
            rot={0.4}
          />
          <Wash
            p={p}
            cx={900}
            cy={140}
            rx={190}
            ry={190}
            color="peach"
            seed={11}
            opacity={0.6}
          />
          <Wash
            p={p}
            cx={980}
            cy={690}
            rx={150}
            ry={240}
            color="sage"
            seed={9}
            opacity={0.6}
          />
          <Wash
            p={p}
            cx={120}
            cy={1260}
            rx={230}
            ry={330}
            color="blue"
            seed={21}
            opacity={0.5}
          />
          <Wash
            p={p}
            cx={130}
            cy={1120}
            rx={160}
            ry={180}
            color="beige"
            seed={4}
            opacity={0.55}
          />
          <Wash
            p={p}
            cx={930}
            cy={1330}
            rx={170}
            ry={230}
            color="peach"
            seed={13}
            opacity={0.5}
          />
          <Band
            p={p}
            w={w}
            h={h}
            y={1400}
            amp={26}
            len={90}
            phase={1.2}
            color={WASH.sky}
            opacity={0.7}
            seed={5}
          />
          <Swoop
            p={p}
            d="M540,1536 C580,1420 700,1360 820,1320 C900,1294 980,1300 1024,1310 L1024,1536 Z"
            color={WASH.blue}
            opacity={0.55}
          />
          <Swoop
            p={p}
            d="M600,1536 C640,1450 740,1400 860,1370 C930,1352 990,1356 1024,1362 L1024,1536 Z"
            color="#fcf6e8"
            opacity={0.6}
          />
          <Grain p={p} w={w} h={h} />
        </>
      }
      motion={
        <>
          <GoldLine
            index={0}
            d="M226,0 C300,90 300,180 220,250 C140,320 40,330 0,395"
          />
          <GoldLine
            index={1}
            d="M690,0 C700,120 780,230 880,262 C950,284 1000,300 1024,318"
          />
          <GoldLine
            index={2}
            d="M0,398 C80,420 120,520 106,600 C96,660 150,700 176,728 C186,742 172,756 178,770 C184,782 190,790 182,802 C174,810 186,818 184,830 C182,842 200,850 202,866 C206,884 180,892 150,904 C100,924 70,1000 80,1060 C92,1120 200,1140 330,1150 C420,1158 480,1140 560,1150 C640,1160 720,1180 800,1210"
          />
          <GoldLine
            index={3}
            d="M1024,720 C940,760 900,840 900,900 C900,960 950,1010 1024,1050"
          />
          <GoldLine
            index={4}
            width={1.6}
            d="M0,1120 C200,1110 320,1180 380,1300 C420,1380 420,1460 410,1536"
          />
          <GoldLine
            index={5}
            d="M500,1536 C520,1400 640,1330 780,1300 C860,1284 940,1300 1024,1340"
          />
          <Seal
            p={p}
            cx={520}
            cy={600}
            r={236}
            ringFontSize={30}
            ringLetterSpacing={3}
          />
          <Tagline
            x={528}
            y={930}
            size={42}
            lines={[
              "From managing chaos to",
              <>
                developing <Perspective />
              </>,
            ]}
            brushX={488}
            brushY={1036}
            brushW={280}
          />
          <Corner
            x={72}
            y={1290}
            lines={["A SAFE SPACE", "FOR REAL", "CHANGE"]}
            size={32}
            gap={48}
          />
        </>
      }
      loop={
        <>
          <Boat x={598} y={1077} s={1.35} />
          <Bird index={0} x={772} y={430} s={1.35} rot={12} />
          <Bird index={1} x={860} y={414} s={1.05} rot={-8} />
          <Bird index={2} x={850} y={498} s={0.95} rot={20} />
        </>
      }
    />
  );
}
