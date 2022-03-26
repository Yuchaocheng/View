import {
  cryptico,
  SHA256
} from './cryptico.min';

import {
  CryptoJS
} from './crypto-3.1.2.min';

import {
  aes_encrypt,
  aes_decrypt
} from './AES.js';

export function encodeBase64(encodeString) {
  try {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encodeString));
  } catch (e) {
    return '';
  }
}

export function decodeBase64(decodeString) {
  try {
    decodeString = decodeString || '';
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(decodeString.replace(/[^A-Za-z0-9+/=]/g, '')));
  } catch (e) {
    return '';
  }
}

export function sha256(encodeString) {
  try {
    //return CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(encodeString));
    /* eslint-disable new-cap */
    return SHA256(encodeString);
    /* eslint-enable new-cap */
  } catch (e) {
    return '';
  }
}

export function md5(encodeString) {
  try {
    return CryptoJS.enc.Hex.stringify(CryptoJS.MD5(encodeString));
  } catch (e) {
    return '';
  }
}

export function encodeAES(encodeString, encodeKey, iv, mode = 'cbc') {
  //ecb值需要加密字符串和key，可以把iv作为mode，cbc iv值必须为16位
  if (iv === 'ecb') {
    mode = 'ecb';
  }
  if ('undefined' === typeof iv) {
    iv = '6cd9616beb39d4034fdebe107df9a399';
  }
  let result = '';
  if ('ecb' === mode) {
    let iStrLen = encodeString.length;
    let iIndex = 0;
    while (iStrLen > 0) {
      if (iStrLen > 16) {
        result += aes_encrypt(encodeString.substring(iIndex, iIndex + 16), encodeKey, true);
      } else {
        result += aes_encrypt(encodeString.substring(iIndex), encodeKey, true);
      }
      iStrLen -= 16;
      iIndex += 16;
    }
  } else if ('cbc' === mode) {
    //CBC
    let szParsedKey = CryptoJS.enc.Hex.parse(encodeKey);
    let szParsedIv = CryptoJS.enc.Hex.parse(iv);
    let szEncrypted = CryptoJS.AES.encrypt(encodeString, szParsedKey, {
      mode: CryptoJS.mode.CBC,
      iv: szParsedIv,
      padding: CryptoJS.pad.Pkcs7
    });
    result = szEncrypted.ciphertext.toString();
  }

  return result;
}

export function decodeAES(szEnStr, szKey, szIv, szMode) {
  var szRes = '';
  if ('ecb' === szMode) {
    let iEnStrLen = szEnStr.length;
    let iIndex = 0;

    while (iEnStrLen > 0) {
      if (iEnStrLen > 32) {
        szRes += aes_decrypt(szEnStr.substring(iIndex, iIndex + 32), szKey, false);
      } else {
        szRes += aes_decrypt(szEnStr.substring(iIndex), szKey, false);
      }
      iEnStrLen -= 32;
      iIndex += 32;
    }
  } else {
    //CBC
    if ('undefined' === typeof szIv) {
      szIv = '6cd9616beb39d4034fdebe107df9a399';
    }
    try {
      let szParsedKey = CryptoJS.enc.Hex.parse(szKey);
      let szParsedIv = CryptoJS.enc.Hex.parse(szIv);
      let szEncryptedHexStr = CryptoJS.enc.Hex.parse(szEnStr);
      let szEncryptedBase64Str = CryptoJS.enc.Base64.stringify(szEncryptedHexStr);
      let szDecrypted = CryptoJS.AES.decrypt(szEncryptedBase64Str, szParsedKey, {
        mode: CryptoJS.mode.CBC,
        iv: szParsedIv,
        padding: CryptoJS.pad.Pkcs7
      });
      szRes = szDecrypted.toString(CryptoJS.enc.Utf8); //base64 encrypted
      //console.log("  decode Res: " +szRes);
    } catch (e) {
      szRes = '';
    }
  }
  return szRes;
}

export function generateRSAPrivateKey(encodeKey, bitLength = 1024) {
  return cryptico().generateRSAKey(encodeKey, bitLength);
}

export function generateRSAPublicKey(privateKey) {
  return cryptico().publicKeyString(privateKey);
}

export function decodeRSA(decodeStr, privateKey) {
  let result = cryptico().decrypt(decodeStr, privateKey);
  result = result.plaintext;
  return result;
}

export function getRSABits() {
  let aRes = window.navigator.userAgent.toLowerCase().match(/msie\s([\d.]+)/);
  return aRes && Number(aRes[1]) < 9 ? 256 : 1024;
}

//密码加密
export function encodePwd(szPwd, oEncodeParam, bIrreversible) {
  var szEncodeKey = '';
  if (!bIrreversible) {
    //secretKey is challenge
    szEncodeKey = sha256(szPwd) + oEncodeParam.challenge;
    for (let i = 1; i < oEncodeParam.iIterate; i++) {
      szEncodeKey = sha256(szEncodeKey);
    }
  } else {
    //secretKey is salt
    szEncodeKey = sha256(oEncodeParam.userName + oEncodeParam.salt + szPwd);
    szEncodeKey = sha256(szEncodeKey + oEncodeParam.challenge);
    for (let i = 2; i < oEncodeParam.iIterate; i++) {
      szEncodeKey = sha256(szEncodeKey);
    }
  }
  return szEncodeKey;
}
