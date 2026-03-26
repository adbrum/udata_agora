import { NextRequest } from "next/server";
import { proxySamlPost, proxySamlGet } from "../../proxy";

export async function POST(request: NextRequest) {
  return proxySamlPost(request, "/saml/eidas/sso_logout");
}

export async function GET(request: NextRequest) {
  return proxySamlGet(request, "/saml/eidas/sso_logout");
}
