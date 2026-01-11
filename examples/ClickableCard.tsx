import { Button } from "@printy-mobile/ui/button";
import { Card, CardContent } from "@printy-mobile/ui/card";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Share2 } from "lucide-react";

interface ClickableCardProps {
  id: string;
  title: string;
  description: string;
  actionLink?: string;
  onShare?: () => void;
}

/**
 * Example clickable card component with proper pointer-events handling
 *
 * Key pattern:
 * - Link covers entire card (z-10)
 * - Content overlay has pointer-events-none
 * - Interactive buttons have pointer-events-auto and higher z-index
 */
export function ClickableCard({
  id,
  title,
  description,
  actionLink,
  onShare,
}: ClickableCardProps) {
  return (
    <Link params={{ itemId: id }} to="/items/$itemId">
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Background/image layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />

        {/* Content overlay - blocks clicks by default */}
        <CardContent className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-4 text-white">
          <h3 className="mb-2 font-bold text-lg">{title}</h3>
          <p className="mb-4 text-gray-200 text-sm">{description}</p>

          {/* Interactive elements - restore click functionality */}
          <div className="pointer-events-auto relative z-20 flex gap-2">
            {actionLink && (
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
                size="sm" // Prevent card navigation
              >
                <a href={actionLink} rel="noopener noreferrer" target="_blank">
                  <ExternalLink className="mr-1" size={14} />
                  Action
                </a>
              </Button>
            )}
            {onShare && (
              <Button
                className="border-white/50 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card navigation
                  onShare();
                }}
                size="sm"
                variant="outline"
              >
                <Share2 className="mr-1" size={14} />
                Share
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
