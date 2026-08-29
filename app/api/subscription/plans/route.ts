import { subscriptionController } from "@/engine/modules/subscription/subscription.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) { 
  try {
    const feedback = await subscriptionController.fetchPlans(request); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
