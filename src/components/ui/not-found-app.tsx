import { Home } from "lucide-react";
import Link from "next/link";

import { defaultLocale } from "@/app/i18n/config/settings";
import { Button } from "@/components/ui/button";

/**
 * Used by the root `not-found` route, which sits outside `[locale]` and
 * therefore outside NextIntlClientProvider. Keep this self-contained.
 */
export default function NotFoundApp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mx-auto w-full max-w-xl">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute left-1/4 top-1/3 size-40 rounded-full bg-primary/10 animate-soft-pulse" />
          <div className="absolute right-1/4 top-2/3 size-32 rounded-full bg-blue-500/10 animate-soft-pulse animation-delay-300" />
          <div className="absolute bottom-1/4 left-1/3 size-36 rounded-full bg-purple-500/10 animate-soft-pulse animation-delay-500" />
        </div>

        <div className="relative z-10">
          <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-9xl font-bold text-transparent animate-fade-in-up">
            404
          </h1>

          <div className="mx-auto mb-8 mt-2 h-1 w-24 bg-linear-to-r from-blue-600 to-purple-600 animate-fade-in" />

          <div className="animate-fade-in-up animation-delay-100">
            <h2 className="mb-2 text-2xl font-semibold">Trang không tồn tại</h2>
            <p className="mb-8 text-muted-foreground">
              Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
            </p>
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <Button asChild className="gap-2 rounded-full px-6" size="lg">
              <Link href={`/${defaultLocale}`}>
                <Home className="size-5" />
                <span>Quay về trang chủ</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
