function getUrl(name: string) {
  return `http://openwrt/cgi-bin/cust/persist.py?name=${name}`;
}

export async function load<T>(name: string): Promise<T | undefined> {
  const response = await fetch(getUrl(name));
  const text = await response.text();
  if (!text?.trim()) {
    console.log("nothing to load");
    return undefined;
  }
  if (!text.startsWith("{")) {
    console.warn("failed to load:", text);
    return undefined;
  }
  return JSON.parse(text);
}

export function send<T>(name: string, value: T) {
  fetch(getUrl(name), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `value=${encodeURIComponent(JSON.stringify(value))}`
  });
}
