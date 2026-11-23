/**
 * Self-contained ISO/IEC 18004 QR Code Matrix Generator (Byte Mode, Error Correction Level L/M)
 * Renders crisp SVG and downloadable PNG canvases without external API calls.
 */

// Galois Field GF(2^8) tables for Reed-Solomon error correction
const EXP_TABLE = new Uint8Array(256);
const LOG_TABLE = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  EXP_TABLE[255] = EXP_TABLE[0];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[(LOG_TABLE[a] + LOG_TABLE[b]) % 255];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = EXP_TABLE[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount);
  const msg = new Uint8Array(data.length + ecCount);
  msg.set(data, 0);

  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

interface VersionSpec {
  version: number;
  totalCodewords: number;
  ecCodewordsPerBlock: number;
  numBlocksG1: number;
  dataCodewordsG1: number;
  numBlocksG2: number;
  dataCodewordsG2: number;
  alignmentPatterns: number[];
}

// Version specifications for Error Correction Level L (versions 1 to 12, supports up to 360+ bytes)
const VERSION_SPECS_L: VersionSpec[] = [
  { version: 1, totalCodewords: 26, ecCodewordsPerBlock: 7, numBlocksG1: 1, dataCodewordsG1: 19, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [] },
  { version: 2, totalCodewords: 44, ecCodewordsPerBlock: 10, numBlocksG1: 1, dataCodewordsG1: 34, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 18] },
  { version: 3, totalCodewords: 70, ecCodewordsPerBlock: 15, numBlocksG1: 1, dataCodewordsG1: 55, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 22] },
  { version: 4, totalCodewords: 100, ecCodewordsPerBlock: 20, numBlocksG1: 1, dataCodewordsG1: 80, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 26] },
  { version: 5, totalCodewords: 134, ecCodewordsPerBlock: 26, numBlocksG1: 1, dataCodewordsG1: 108, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 30] },
  { version: 6, totalCodewords: 172, ecCodewordsPerBlock: 18, numBlocksG1: 2, dataCodewordsG1: 68, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 34] },
  { version: 7, totalCodewords: 196, ecCodewordsPerBlock: 20, numBlocksG1: 2, dataCodewordsG1: 78, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 22, 38] },
  { version: 8, totalCodewords: 242, ecCodewordsPerBlock: 24, numBlocksG1: 2, dataCodewordsG1: 97, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 24, 42] },
  { version: 9, totalCodewords: 292, ecCodewordsPerBlock: 30, numBlocksG1: 2, dataCodewordsG1: 116, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 26, 46] },
  { version: 10, totalCodewords: 346, ecCodewordsPerBlock: 18, numBlocksG1: 2, dataCodewordsG1: 68, numBlocksG2: 2, dataCodewordsG2: 69, alignmentPatterns: [6, 28, 50] },
  { version: 11, totalCodewords: 404, ecCodewordsPerBlock: 20, numBlocksG1: 4, dataCodewordsG1: 81, numBlocksG2: 0, dataCodewordsG2: 0, alignmentPatterns: [6, 30, 54] },
  { version: 12, totalCodewords: 466, ecCodewordsPerBlock: 24, numBlocksG1: 2, dataCodewordsG1: 92, numBlocksG2: 2, dataCodewordsG2: 93, alignmentPatterns: [6, 32, 58] },
];

function getBCHTypeInfo(data: number): number {
  let d = data << 10;
  const poly = 0b10100110111;
  while (Math.clz32(d) <= 21) {
    d ^= poly << (21 - Math.clz32(d));
  }
  return ((data << 10) | d) ^ 0b101010000010010;
}

function getBCHVersionInfo(version: number): number {
  let d = version << 12;
  const poly = 0b1111100100101;
  while (Math.clz32(d) <= 19) {
    d ^= poly << (19 - Math.clz32(d));
  }
  return (version << 12) | d;
}

export function generateQRMatrix(text: string): boolean[][] {
  const utf8Bytes = new TextEncoder().encode(text);

  // Pick smallest version that fits utf8Bytes in Byte mode (mode indicator 4 bits + length 8 or 16 bits)
  let spec = VERSION_SPECS_L[VERSION_SPECS_L.length - 1];
  for (const candidate of VERSION_SPECS_L) {
    const totalDataCap =
      candidate.numBlocksG1 * candidate.dataCodewordsG1 +
      candidate.numBlocksG2 * candidate.dataCodewordsG2;
    const lenBits = candidate.version <= 9 ? 8 : 16;
    const maxBytes = Math.floor((totalDataCap * 8 - 4 - lenBits) / 8);
    if (utf8Bytes.length <= maxBytes) {
      spec = candidate;
      break;
    }
  }

  const totalDataCodewords =
    spec.numBlocksG1 * spec.dataCodewordsG1 + spec.numBlocksG2 * spec.dataCodewordsG2;

  // Build bit buffer
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >>> i) & 1);
    }
  };

  // Byte mode indicator (0100)
  pushBits(0b0100, 4);
  const countBits = spec.version <= 9 ? 8 : 16;
  const payload = utf8Bytes.slice(0, totalDataCodewords - 3);
  pushBits(payload.length, countBits);

  for (let i = 0; i < payload.length; i++) {
    pushBits(payload[i], 8);
  }

  // Terminator (up to 4 zero bits)
  const maxBits = totalDataCodewords * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) {
    bits.push(0);
  }
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // Pad bytes (0xEC, 0x11)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  const dataWords = new Uint8Array(totalDataCodewords);
  for (let i = 0; i < totalDataCodewords; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    dataWords[i] = b;
  }

  // Split into blocks and compute Reed-Solomon EC
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let i = 0; i < spec.numBlocksG1; i++) {
    const block = dataWords.slice(offset, offset + spec.dataCodewordsG1);
    offset += spec.dataCodewordsG1;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, spec.ecCodewordsPerBlock));
  }
  for (let i = 0; i < spec.numBlocksG2; i++) {
    const block = dataWords.slice(offset, offset + spec.dataCodewordsG2);
    offset += spec.dataCodewordsG2;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, spec.ecCodewordsPerBlock));
  }

  // Interleave data and EC codewords
  const finalCodewords: number[] = [];
  const maxDataLen = Math.max(spec.dataCodewordsG1, spec.dataCodewordsG2);
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) finalCodewords.push(block[i]);
    }
  }
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (const block of ecBlocks) {
      if (i < block.length) finalCodewords.push(block[i]);
    }
  }

  // Initialize matrix
  const size = spec.version * 4 + 17;
  const modules: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array<boolean | null>(size).fill(null)
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  );

  const setFunctionModule = (r: number, c: number, dark: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = dark;
      isFunction[r][c] = true;
    }
  };

  // Finder patterns + separators
  const drawFinder = (row: number, col: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const inRing = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunctionModule(r, c, inOuter && (inRing || inCenter));
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  const alignCoords = spec.alignmentPatterns;
  for (let i = 0; i < alignCoords.length; i++) {
    for (let j = 0; j < alignCoords.length; j++) {
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === alignCoords.length - 1) ||
        (i === alignCoords.length - 1 && j === 0)
      ) {
        continue;
      }
      const cr = alignCoords[i];
      const cc = alignCoords[j];
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunctionModule(cr + dr, cc + dc, dark);
        }
      }
    }
  }

  // Dark module
  setFunctionModule(4 * spec.version + 9, 8, true);

  // Reserve format information areas
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][i]) setFunctionModule(8, i, false);
    if (!isFunction[i][8]) setFunctionModule(i, 8, false);
    if (!isFunction[8][size - 1 - i]) setFunctionModule(8, size - 1 - i, false);
    if (!isFunction[size - 1 - i][8]) setFunctionModule(size - 1 - i, 8, false);
  }
  if (!isFunction[8][8]) setFunctionModule(8, 8, false);

  // Version information (for version >= 7)
  if (spec.version >= 7) {
    const vInfo = getBCHVersionInfo(spec.version);
    for (let i = 0; i < 18; i++) {
      const bit = ((vInfo >>> i) & 1) === 1;
      const r = Math.floor(i / 3);
      const c = size - 11 + (i % 3);
      setFunctionModule(r, c, bit);
      setFunctionModule(c, r, bit);
    }
  }

  // Place data bits (upward/downward 2-column zig-zag)
  let bitIdx = 0;
  const totalBits = finalCodewords.length * 8;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!isFunction[r][c]) {
          let dark = false;
          if (bitIdx < totalBits) {
            const byteVal = finalCodewords[bitIdx >>> 3];
            dark = ((byteVal >>> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          // Apply Mask Pattern 0: (r + c) % 2 === 0
          if ((r + c) % 2 === 0) {
            dark = !dark;
          }
          modules[r][c] = dark;
        }
      }
    }
    upward = !upward;
  }

  // Write Format Information (Level L = 01, Mask 0 = 000 -> data = 0b01000)
  const typeBits = getBCHTypeInfo(0b01000);
  for (let i = 0; i < 15; i++) {
    const bit = ((typeBits >>> i) & 1) === 1;
    // Vertical / top-left
    if (i < 6) {
      modules[i][8] = bit;
    } else if (i < 8) {
      modules[i + 1][8] = bit;
    } else {
      modules[size - 15 + i][8] = bit;
    }

    // Horizontal
    if (i < 8) {
      modules[8][size - 1 - i] = bit;
    } else if (i < 9) {
      modules[8][15 - i] = bit;
    } else {
      modules[8][14 - i] = bit;
    }
  }

  return modules.map((row) => row.map((cell) => Boolean(cell)));
}
