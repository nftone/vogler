const { Blockbook } = require("blockbook-client");
const blockbook = new Blockbook({
  nodes: ["btc1.trezor.io", "btc2.trezor.io"],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const creations = [
  {
    name: "Nothing",
    h: "d5abd1da80839519adad13a5803e86e196a885672c74efe91c9fb4604401a6ca",
    expectedOwner: "1HAQwLuYoVba5GkEe7VNUuzgQHmnS6B2LC",
  },
  {
    name: "The number 0",
    h: "07258933905fb96be10e61a68f47b289dcd6b04b22b5ce276a2c593e83bc236a",
    expectedOwner: "1FmCRu89Snuk9DZeuskAnEmjbstiWuGvVH",
  },
  {
    name: "The number 1",
    h: "76a7d228de4a01ad75b2ca8fdd0c7eb009b547eb4a73b04a356c136da2d1259e",
    expectedOwner: "",
  },
  {
    name: "The number 6653184326643486635834546035076418400106306154239717921 or “Everything is a number!”",
    h: "14877af871857cc5110532c79865743f744172750ca07d57f344cceae1200c36",
    expectedOwner: "",
  },
  {
    name: "Black Square (1 x 1 pixels)",
    h: "50912d409dc1af994e64b79f8c069f2110084fd5d18f04a06ee537c916e7c530",
    expectedOwner: "",
  },
  {
    name: "White Square (1 x 1 pixels)",
    h: "9f2a4c66d2faf7be3f89b56ef6039574d65511e73571ab4fe296d2811230ad20",
    expectedOwner: "",
  },
  {
    name: "Transparent Square (1 x 1 pixels)",
    h: "156879cf464b5a603a2d5e41f37e6cff542c8e38de8ffeccdb6d6614ce67051d",
    expectedOwner: "",
  },
  {
    name: "Nibble 0 (2 x 2 pixels)",
    h: "78c0a6aae302b269a88dc4d0076e5831b443f3b0da84759b273e775ef779214e",
    expectedOwner: "",
  },
  {
    name: "Nibble 1 (2 x 2 pixels)",
    h: "52265b84e6d52487f37cd0687cd06eeae633b4cf553caecad5f4ed10cf535b05",
    expectedOwner: "",
  },
  {
    name: "Nibble 2 (2 x 2 pixels)",
    h: "665615d1ea0421314c8f4ed52ef3c464b3d93a924f89eab2253d437093fc5231",
    expectedOwner: "",
  },
  {
    name: "Nibble 3 (2 x 2 pixels)",
    h: "5983a891fca661f3d242a508d918cb464917f4e72d0184d7d58183b00898beae",
    expectedOwner: "",
  },
  {
    name: "Nibble 4 (2 x 2 pixels)",
    h: "a6262b4e5ba8eeedacf1a6d5e48c0896501d204d14dd971235163dda7eb9ce4c",
    expectedOwner: "1MiV8rzEHzEbKbWmhuaASBKF2y46YtZvKc",
  },
  {
    name: "Nibble 5 (2 x 2 pixels)",
    h: "d60f86947191c29762e7ff0a478b73f3ae4321b70eb75ee203d27c870a104f05",
    expectedOwner: "",
  },
  {
    name: "Nibble 6 (2 x 2 pixels)",
    h: "a87d24e3e9868fec7c79d99d779a21367def4aaca64dfba768a47b3872c1bbc4",
    expectedOwner: "",
  },
  {
    name: "Nibble 7 (2 x 2 pixels)",
    h: "0cb1d90e1e4c57e61d291b76e33de47e18226b8b8807e3bffdae18ffc26fa61a",
    expectedOwner: "",
  },
  {
    name: "Nibble 8 (2 x 2 pixels)",
    h: "1c4ac3eb7404252511e78113c9346ed116ab511cb786b86c9b90a3098486edfa",
    expectedOwner: "",
  },
  {
    name: "Nibble 9 (2 x 2 pixels)",
    h: "2e59fd90d1b5260d8ec93e413b011b175f9dc8393a114f5ff9add415a4da4354",
    expectedOwner: "",
  },
  {
    name: "Nibble 10 (2 x 2 pixels)",
    h: "b7cccc8e01041941ffefcd77589282b6816bd5405deb9d2090594a53009b6f43",
    expectedOwner: "",
  },
  {
    name: "Nibble 11 (2 x 2 pixels)",
    h: "1dd13b3699ca5d7ad9b785193160d3cd20febf15ca9ccaa391b662d221086659",
    expectedOwner: "",
  },
  {
    name: "Nibble 12 (2 x 2 pixels)",
    h: "58bd847d134b42a79a95b3d8316f2c280d21254580beedd7a1b79925754da7ea",
    expectedOwner: "",
  },
  {
    name: "Nibble 13 (2 x 2 pixels)",
    h: "406e4c8b44cb1d9ff8000325a25724d5dcdbb7fe1b23399a5d553e3779b1614b",
    expectedOwner: "",
  },
  {
    name: "Nibble 14 (2 x 2 pixels)",
    h: "ce161f62baf1c49e5641850a34f98158ecc1a3e17eca1de54443507890f1e2d2",
    expectedOwner: "",
  },
  {
    name: "Nibble 15 (2 x 2 pixels)",
    h: "aae7df7ced09eca353e09dfe07e51e8567c2d9a9c317416ed6fa30accf9c5bfb",
    expectedOwner: "",
  },
  {
    name: "All Nibbles (8 x 8 pixels)",
    h: "6fb4d44a84ccf83703aad328fb2542cf1aadbb698120cec4fbd44c55b65b0225",
    expectedOwner: "",
  },
  {
    name: "Face 1 (4 x 4 pixels)",
    h: "59003f5a8f53b3b0be32101769190581eb407e3eeb01e9922eafb76254e22ae8",
    expectedOwner: "",
  },
  {
    name: "Face 2 (8 x 8 pixels)",
    h: "b9b9ff65ab82b52f65c0b3448e8c029757e47504deef12c1aeedaf9fcbe53278",
    expectedOwner: "",
  },
  {
    name: "Face 3 (16 x 16 pixels)",
    h: "12066352b36e82ff0e9821f36ff287bdf4186dbb494cbcbc4693ae2bfe459b61",
    expectedOwner: "",
  },
  {
    name: "Face 4 (32 x 32 pixels)",
    h: "6900334301f99fc620a9b45509dfd4c94f04a7d948518e7e7fdab528ff2aac39",
    expectedOwner: "",
  },
  {
    name: "Face 5 (64 x 64 pixels)",
    h: "04a9187bea83542976016a38c8a7004a5e9c3b4983520c3246df197a52d248ba",
    expectedOwner: "bc1qds0huy4fthugnv2wfx2ujl0lt0a3dzdu2hu4t6",
  },
  {
    name: "Secret (Unknown)",
    h: "8369c6d5253de810b596c47577686f206ce27d71c8804433f0321a9a35178744",
    expectedOwner: "",
  },
];

const main = async () => {
  try {
    const owner = await findOwnerByTxHash(creations[28].h);
    console.log(owner === creations[28].expectedOwner, owner, "owner");
  } catch (error) {
    console.error(error);
  }
};

const findOwnerByTxHash = async (txHash) => {
  console.log("txHash", txHash);
  let currentTxHash = txHash;

  for (;;) {
    try {
      await sleep(200);
      const { owner, voutHash } = await getOwnerOrVoutHash(currentTxHash);
      if (owner) return owner;
      currentTxHash = voutHash;
    } catch (error) {
      console.error(error);
    }
  }
};

const getOwnerOrVoutHash = async (txHash) => {
  const { vout } = await blockbook.getTx(txHash);
  const spentTx = vout.find(({ spent }) => spent);
  if (spentTx) return { voutHash: spentTx.spentTxId };
  return { owner: vout[0].addresses[0] };
};

main();
