import { NextRequest } from "next/server";
import { proxySamlPost } from "../../proxy";

export async function POST(request: NextRequest) {
  return proxySamlPost(request, "/saml/eidas/sso");
}
