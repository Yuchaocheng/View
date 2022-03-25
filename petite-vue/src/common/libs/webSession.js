export function getItem(szAttr) {
    return sessionStorage.getItem(szAttr);
}

export function setItem(szAttr, szVal) {
    return sessionStorage.setItem(szAttr, szVal);
}

export function removeItem(szAttr) {
    sessionStorage.removeItem(szAttr);
}
