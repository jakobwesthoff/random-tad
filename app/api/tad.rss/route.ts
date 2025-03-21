// File path: app/api/tad.rss/route.ts
import { NextRequest } from "next/server";
import { IncomingMessage } from "http";
import https from "https";
import http from "http";
import { Readable } from "stream";

export const runtime = "nodejs";

// Original RSS Url we are proxying from and cache config
const RSS_FEED_URL = "https://14kltzj.podcaster.de/tad.rss";
const CACHE_MAX_AGE = 60 * 60; // 1 hour
const CACHE_STALE_WHILE_REVALIDATE = 30 * 60; // 30 min

/**
 * Converts a Node.js Readable stream to a Web ReadableStream
 * @param nodeStream The Node.js Readable stream
 * @returns A Web API ReadableStream
 */
function nodeToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

/**
 * Proxies an HTTP request and returns the raw response
 * @param url The URL to proxy
 * @param headers Optional headers to include in the request
 * @returns A Promise that resolves to a Response object
 */
function proxyRequest(
  url: string,
  headers: Record<string, string> = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === "https:" ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers,
    };

    const req = protocol.request(options, (res: IncomingMessage) => {
      // Create Response headers from IncomingMessage headers
      const responseHeaders = new Headers();

      Object.entries(res.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          responseHeaders.set(
            key,
            Array.isArray(value) ? value.join(", ") : value,
          );
        }
      });

      // Convert Node.js stream to Web API stream
      const webStream = nodeToWebStream(res);

      // Cache at vercels edge server
      responseHeaders.set(
        "Cache-Control",
        `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
      );

      // Create and resolve the Response with the readable stream
      resolve(
        new Response(webStream, {
          status: res.statusCode || 200,
          statusText: res.statusMessage || "",
          headers: responseHeaders,
        }),
      );
    });

    req.on("error", (error: Error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * GET handler for Next.js API route
 * @param request The incoming request
 * @returns A Response object with the proxied content
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Forward relevant headers from the client request
    const headers: Record<string, string> = {
      "Accept-Encoding":
        request.headers.get("Accept-Encoding") || "gzip, deflate, br",
      Accept:
        request.headers.get("Accept") ||
        "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": request.headers.get("User-Agent") || "random-tad/1.0",
    };

    // Proxy the request and return the response
    return await proxyRequest(RSS_FEED_URL, headers);
  } catch (error) {
    console.error("Proxy error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(errorMessage, {
      status: 500,
    });
  }
}
