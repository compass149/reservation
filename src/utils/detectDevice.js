export function getAgent() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
      return "mobile";
    }
    return "pc";
  }