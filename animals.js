// Stylized flat-design SVGs for the Haka! roster.
// Each function returns an inline SVG string. ViewBox is 200x200.

const wrap = (inner) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

// Long slanted shadow shared by all (mockup motif).
const shadow = (path) => `<g opacity="0.18" transform="translate(40,40)"><path d="${path}" fill="#000"/></g>`;

export const eagle = () => {
  // Bald eagle: spread wings, white head, yellow beak.
  const lWing = `M100 92
    C 72 78 50 78 28 88
    C 44 84 60 84 72 88
    C 50 88 30 96 14 110
    C 36 102 54 102 70 104
    C 50 106 32 116 20 130
    C 42 120 60 118 76 118
    C 60 124 46 134 38 146
    C 58 138 76 134 92 130
    L 100 110 Z`;
  const rWing = `M100 92
    C 128 78 150 78 172 88
    C 156 84 140 84 128 88
    C 150 88 170 96 186 110
    C 164 102 146 102 130 104
    C 150 106 168 116 180 130
    C 158 120 140 118 124 118
    C 140 124 154 134 162 146
    C 142 138 124 134 108 130
    L 100 110 Z`;
  const body = `M100 70
    C 88 70 84 80 86 96
    L 88 124
    C 88 140 96 152 100 156
    C 104 152 112 140 112 124
    L 114 96
    C 116 80 112 70 100 70 Z`;
  const head = `M100 72
    C 88 70 84 60 90 50
    C 94 42 100 38 100 38
    C 100 38 106 42 110 50
    C 116 60 112 70 100 72 Z`;
  const beak = `M98 56 L106 58 L102 66 Q100 68 98 66 Z`;
  const eye = `M104 52 a1.4 1.4 0 1 0 0.01 0 Z`;
  return wrap(`
    <g fill="#26292d">
      <path d="${lWing}"/>
      <path d="${rWing}"/>
      <path d="${body}"/>
    </g>
    <path d="${head}" fill="#f4eee2"/>
    <path d="${beak}" fill="#f0b836"/>
    <path d="${eye}" fill="#26292d"/>
  `);
};

export const dragonfly = (color = '#e8862c') => {
  // Long thin body with 4 translucent wings
  const wingLeftTop = `M100 80 Q60 70 24 86 Q48 92 78 96 Z`;
  const wingRightTop = `M100 80 Q140 70 176 86 Q152 92 122 96 Z`;
  const wingLeftBot = `M100 100 Q60 96 24 116 Q56 114 80 110 Z`;
  const wingRightBot = `M100 100 Q140 96 176 116 Q144 114 120 110 Z`;
  return wrap(`
    <g>
      <g fill="#dbe7e3" opacity="0.85">
        <path d="${wingLeftTop}"/>
        <path d="${wingRightTop}"/>
        <path d="${wingLeftBot}"/>
        <path d="${wingRightBot}"/>
      </g>
      <g fill="#23282b">
        <circle cx="100" cy="60" r="14"/>
        <circle cx="92" cy="56" r="4" fill="${color}"/>
        <circle cx="108" cy="56" r="4" fill="${color}"/>
        <path d="M88 60 Q82 50 78 44" stroke="#23282b" stroke-width="3" fill="none"/>
        <path d="M112 60 Q118 50 122 44" stroke="#23282b" stroke-width="3" fill="none"/>
      </g>
      <path d="M100 70 L96 96 L94 170 L100 178 L106 170 L104 96 Z" fill="${color}"/>
      <path d="M100 70 L100 178" stroke="#23282b" stroke-width="3"/>
      <path d="M96 96 L104 96 M94 120 L106 120 M94 140 L106 140 M94 160 L106 160" stroke="#23282b" stroke-width="2"/>
    </g>
  `);
};

export const frog = () => {
  // Poison dart frog — blue with dark stripes
  const body = `M70 110 Q70 70 100 70 Q130 70 130 110 L130 130 Q130 150 100 150 Q70 150 70 130 Z`;
  return wrap(`
    <g fill="#5b6cc4">
      <ellipse cx="80" cy="74" rx="22" ry="20"/>
      <ellipse cx="120" cy="74" rx="22" ry="20"/>
      <path d="${body}"/>
      <path d="M50 100 Q30 110 24 140 Q26 154 38 154 Q42 142 52 132 Z"/>
      <path d="M150 100 Q170 110 176 140 Q174 154 162 154 Q158 142 148 132 Z"/>
      <path d="M70 150 Q60 170 50 188 Q60 188 80 170 Z"/>
      <path d="M130 150 Q140 170 150 188 Q140 188 120 170 Z"/>
    </g>
    <g fill="#23272d">
      <circle cx="80" cy="74" r="6"/>
      <circle cx="120" cy="74" r="6"/>
      <path d="M70 96 Q100 102 130 96 L130 108 Q100 116 70 108 Z"/>
      <path d="M70 128 Q100 134 130 128 L130 140 Q100 148 70 140 Z"/>
    </g>
  `);
};

export const butterfly = () => {
  // Bright yellow-green wings, black body
  const leftWing = `M100 100 Q40 50 30 110 Q60 130 100 120 Z`;
  const leftLow = `M100 110 Q60 130 56 168 Q90 158 100 130 Z`;
  const rightWing = `M100 100 Q160 50 170 110 Q140 130 100 120 Z`;
  const rightLow = `M100 110 Q140 130 144 168 Q110 158 100 130 Z`;
  return wrap(`
    <g>
      <path d="${leftWing}" fill="#c8e23a"/>
      <path d="${rightWing}" fill="#c8e23a"/>
      <path d="${leftLow}" fill="#2a2f33"/>
      <path d="${rightLow}" fill="#2a2f33"/>
      <path d="M100 100 Q40 50 30 110 Q60 130 100 120 Z" fill="none" stroke="#1d2126" stroke-width="3"/>
      <path d="M100 100 Q160 50 170 110 Q140 130 100 120 Z" fill="none" stroke="#1d2126" stroke-width="3"/>
      <ellipse cx="100" cy="120" rx="6" ry="38" fill="#1d2126"/>
      <circle cx="100" cy="80" r="8" fill="#1d2126"/>
      <path d="M96 74 Q92 54 84 50 M104 74 Q108 54 116 50" stroke="#1d2126" stroke-width="2" fill="none"/>
    </g>
  `);
};

export const mantaray = () => {
  // Diamond shape, dark with light spots
  const body = `M100 60 L40 130 L70 150 L100 144 L130 150 L160 130 Z`;
  return wrap(`
    <g>
      <path d="${body}" fill="#2c3a4a"/>
      <path d="M100 144 L100 196 Q104 196 102 188 Z" fill="#2c3a4a"/>
      <g fill="#dde6ed" opacity="0.55">
        <circle cx="68" cy="120" r="3"/><circle cx="80" cy="110" r="2.5"/><circle cx="92" cy="118" r="2.5"/>
        <circle cx="108" cy="118" r="2.5"/><circle cx="120" cy="110" r="2.5"/><circle cx="132" cy="120" r="3"/>
        <circle cx="56" cy="128" r="2"/><circle cx="76" cy="132" r="2"/><circle cx="100" cy="128" r="2.5"/>
        <circle cx="124" cy="132" r="2"/><circle cx="144" cy="128" r="2"/>
        <circle cx="86" cy="142" r="2"/><circle cx="114" cy="142" r="2"/>
      </g>
      <circle cx="78" cy="98" r="3" fill="#0f1418"/>
      <circle cx="122" cy="98" r="3" fill="#0f1418"/>
    </g>
  `);
};

export const squid = () => {
  // Red squid pointing down with tentacles
  return wrap(`
    <g fill="#e25a47">
      <path d="M100 40 L70 96 L72 130 L100 138 L128 130 L130 96 Z"/>
      <path d="M72 130 Q66 150 60 178 Q72 172 80 154 Z"/>
      <path d="M128 130 Q134 150 140 178 Q128 172 120 154 Z"/>
      <path d="M86 132 Q82 160 80 188 Q92 172 96 144 Z"/>
      <path d="M114 132 Q118 160 120 188 Q108 172 104 144 Z"/>
      <path d="M100 138 Q98 168 100 192 Q102 168 100 138 Z"/>
    </g>
    <g fill="#f7c9bf" opacity="0.85">
      <circle cx="76" cy="148" r="2.4"/><circle cx="86" cy="160" r="2.4"/><circle cx="96" cy="172" r="2.4"/>
      <circle cx="124" cy="148" r="2.4"/><circle cx="114" cy="160" r="2.4"/><circle cx="104" cy="172" r="2.4"/>
      <circle cx="100" cy="156" r="2"/><circle cx="100" cy="180" r="2"/>
    </g>
    <g fill="#1c1f24">
      <circle cx="88" cy="86" r="4"/><circle cx="112" cy="86" r="4"/>
    </g>
  `);
};

export const bee = () => {
  // Yellow + black striped body, translucent wings
  return wrap(`
    <g>
      <ellipse cx="70" cy="80" rx="34" ry="22" fill="#eef3e7" opacity="0.85"/>
      <ellipse cx="130" cy="80" rx="34" ry="22" fill="#eef3e7" opacity="0.85"/>
      <ellipse cx="100" cy="110" rx="40" ry="56" fill="#f0c130"/>
      <path d="M62 90 Q100 100 138 90" stroke="#1f1f1f" stroke-width="0" fill="none"/>
      <g fill="#1f1f1f">
        <path d="M62 92 Q100 102 138 92 L142 110 Q100 116 58 110 Z"/>
        <path d="M58 124 Q100 132 142 124 L138 140 Q100 144 62 140 Z"/>
        <path d="M64 152 Q100 158 136 152 L130 164 Q100 170 70 164 Z"/>
        <ellipse cx="100" cy="62" rx="22" ry="20"/>
        <path d="M86 44 Q78 32 70 28 M114 44 Q122 32 130 28" stroke="#1f1f1f" stroke-width="2" fill="none"/>
        <circle cx="92" cy="60" r="3" fill="#f0c130"/>
        <circle cx="108" cy="60" r="3" fill="#f0c130"/>
      </g>
    </g>
  `);
};

export const snake = () => {
  // Coiled green snake with yellow markings
  return wrap(`
    <g>
      <path d="M120 40 Q160 60 150 100 Q130 130 90 120 Q60 110 70 150 Q90 180 140 170"
            stroke="#3aa15f" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M120 40 Q160 60 150 100 Q130 130 90 120 Q60 110 70 150 Q90 180 140 170"
            stroke="#f0c130" stroke-width="6" fill="none" stroke-dasharray="4 14" stroke-linecap="round"/>
      <circle cx="124" cy="38" r="12" fill="#3aa15f"/>
      <circle cx="128" cy="34" r="2.5" fill="#1c1c1c"/>
      <path d="M132 40 L142 38 M132 42 L142 46" stroke="#e0413a" stroke-width="2" fill="none"/>
    </g>
  `);
};

// Lookup table
export const ANIMALS = {
  eagle:     { name: 'Eagle',     unlock: 250, svg: eagle },
  dragonfly: { name: 'Dragonfly', unlock: 0,   svg: () => dragonfly('#e8862c') },
  bee:       { name: 'Bee',       unlock: 45,  svg: bee },
  snake:     { name: 'Snake',     unlock: 45,  svg: snake },
  frog:      { name: 'Frog',      unlock: 250, svg: frog },
  squid:     { name: 'Squid',     unlock: 250, svg: squid },
  mantaray:  { name: 'Manta Ray', unlock: 500, svg: mantaray },
  butterfly: { name: 'Butterfly', unlock: 500, svg: butterfly },
  // a dim variant for the top-tier dragonfly
  dragonflyGold: { name: 'Golden Dragonfly', unlock: 500, svg: () => dragonfly('#f0c130') },
};

export const TIERS = [
  { points: 500, keys: ['dragonflyGold', 'mantaray', 'butterfly'] },
  { points: 250, keys: ['frog', 'eagle', 'squid'] },
  { points: 45,  keys: ['bee', 'dragonfly', 'snake'] },
];
