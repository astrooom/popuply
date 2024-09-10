"use client"

import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RegenerateWebhookTokenButton({ siteId, currentToken }: { siteId: string, currentToken?: string }) {

  const { refresh } = useRouter()

  const regenerateToken = async () => {
    const response = await fetch(`/api/sites/${siteId}/webhook`, {
      method: 'PATCH',
    });

    const { error } = await response.json();

    if (error) {
      toast.error(error);
    } else {
      toast.success('Webhook token regenerated!');
      refresh();
    }
  }

  return (
    <Button
      size="sm"
      variant={currentToken ? "outline" : "default"}
      onClick={() => regenerateToken()}
    >
      <RefreshCw className="w-3 h-3 mr-2" />

      {currentToken ? "Regenerate Webhook Link" : "Generate Webhook Link"}

    </Button>
  )

}