const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require("ethereumjs-util");

/**
 * generate a bip39 mneumonic
 * @function
 * @name generateBIP39Mneumonic
 * @returns {String} a mneumonic for an hd wallet
 */
const generateBIP39Mneumonic = () => bip39.generateMnemonic();

/**
 * genetate a hex encoded keypair from mneumonic and path
 * @function
 * @name mneumonicToKeypair
 * @param {String} mnemonic for hd wallet
 * @param {String} hdPath path to keypair
 * @returns {Object} hex encoded keypair
 */
const mneumonicToKeypair = (mnemonic, hdPath) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  //   const masterPrivateKey = root.privateKey.toString('hex');
  //   console.log(root);

  // Note: Treat your root.publicKey as securely as you would treat your
  // masterPrivateKey as you can still generate the addresses without it.

  const addrNode = root.derive(hdPath);

  // eslint-disable-next-line
  const pubKey = ethUtil.privateToPublic(addrNode._privateKey);

  return {
    publicKey: pubKey.toString("hex"),
    privateKey: addrNode._privateKey.toString("hex")
  };
};

/**
 * convert a public key to an ethereum address
 * @function
 * @name publicKeyToAddress
 * @param {String} pubKey in hex
 * @returns {String} hex encoded checksum valid ethereum address
 */
const publicKeyToAddress = pubKey => {
  const addr = ethUtil
    .publicToAddress(Buffer.from(pubKey, "hex"))
    .toString("hex");
  const address = ethUtil.toChecksumAddress(addr);
  return address;
};

module.exports = {
  generateBIP39Mneumonic,
  mneumonicToKeypair,
  publicKeyToAddress
};
