export const setCookie = (
  cname: string,
  cvalue: string,
  expires: number = 1
) => {
  const d = new Date();
  d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
  let schedule = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + encodeURIComponent(cvalue) + ";" + schedule + ";path=/";
};

export const getCookie = (cname: string) => {
  let cookie = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cookie) == 0) {
      const cookie_res = c.substring(cookie.length, c.length);
      return decodeURIComponent(cookie_res);
    }
  }
  return null;
};

export const removeCookie = (cname: string) => {
  let cookie = getCookie(cname);
  if (cookie != "") {
    document.cookie =
      cname + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
};
