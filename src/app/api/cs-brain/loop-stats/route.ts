import { loopStats } from "@/lib/cs-brain/data";

export async function GET() {
  return Response.json(loopStats);
}
