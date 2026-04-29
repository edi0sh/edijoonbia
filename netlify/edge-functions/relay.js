export default async (request) => {
  try {
    const target = Deno.env.get("TARGET_DOMAIN");

    if (!target) {
      return new Response("TARGET_DOMAIN is not set", { status: 500 });
    }

    const url = new URL(request.url);

    // ساخت URL مقصد
    const targetUrl = `${target}${url.pathname}${url.search}`;

    // کپی headerها
    const headers = new Headers(request.headers);

    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", "https");

    // حذف headerهای مشکل‌دار
    headers.delete("host");
    headers.delete("content-length");

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    return response;

  } catch (err) {
    return new Response("Relay Error: " + err.message, {
      status: 502,
    });
  }
};
