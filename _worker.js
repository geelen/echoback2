export default {
  async fetch(request, env) {
    const { url, method } = request
    const headers = {}

    for (const [k, v] of request.headers.entries()) {
      headers[k] = v
    }
    
    let count = 'No DO attached :('
    if (env.MY_DURABLE_OBJECT) {
      let id = env.MY_DURABLE_OBJECT.idFromName("A");
      let obj = env.MY_DURABLE_OBJECT.get(id);
      let resp = await obj.fetch(request.url);
      count = await resp.text();
    }

    let kv_response = 'nup'
    if (env.MY_KV_NAMESPACE) {
  	  kv_response = await env.MY_KV_NAMESPACE.get('OMFG')
    }


    const payload = {
      envs: Object.keys(env),
      do_response: "Durable Object 'A' count: " + count,
      kv_response,
      change: "ECHOBACK 2",
      headers,
      url,
      method,
      body: await request.text(),
      cf: request.cf
    }
    console.log(payload)
    return new Response(JSON.stringify(payload), {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}
