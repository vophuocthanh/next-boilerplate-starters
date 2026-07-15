# Code Review — nextjs-boilerplate-2025

Ngày review: 2026-07-09 · Branch: `develop` · Next.js 16.2.10 / React 19.2.7

Tài liệu này ghi lại kết quả đọc toàn bộ source code trong `src/`, cộng với config, Docker và CI. Mỗi mục có mức độ ưu tiên và hướng xử lý cụ thể.

**Tóm tắt:** cấu trúc thư mục và tách lớp khá tốt, nhưng có **4 bug thật sự làm chức năng không chạy** (auth token không bao giờ được lưu, `global-error.tsx` sẽ crash, circular import giữa 2 service, Dockerfile production chạy `pnpm dev`). Ngoài ra có khoảng **15 file code chết** hoàn toàn không ai import, và một số helper tự viết lại lodash một cách sai lệch.

---

## ✅ Trạng thái khắc phục (cập nhật 2026-07-09)

**Đợt 1, 2, 3 đã hoàn thành.** Đã verify bằng `pnpm lint` + `pnpm typecheck` + `pnpm build` + chạy thật server standalone và curl từng route.

| Đợt                     | Trạng thái  | Ghi chú                                                                                    |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| Đợt 1 — Bug             | ✅ Xong     | Cả 4 bug chính + 2 bug mới phát hiện trong lúc sửa (xem [1.10](#110), [1.11](#111))        |
| Đợt 2 — Code chết       | ✅ Xong     | Xoá 20 file + 5 SVG mặc định, gỡ 9 dependency                                              |
| Đợt 3 — Docker & CI     | ✅ Xong     | Multi-stage Dockerfile, `output: "standalone"`, CI có quality gate                         |
| Đợt 4 — Kiến trúc       | ⚠️ Một phần | Đã làm: `lang={locale}`, `Promise.all`, type-safe `DashboardTranslations`, gộp ThemeToggle |
| Đợt 5 — Tính năng thiếu | ❌ Chưa     | Auth flow, test, SEO metadata — cần quyết định thêm                                        |

**Hai vấn đề còn lại, cố ý chưa đụng tới** (thuộc Đợt 4/5, cần quyết định của bạn):

- **Sidebar không responsive** ([3.5](#35-adminlayout-bọc-sidebar-nhưng-sidebar-không-responsive-)) — trên mobile sidebar đè lên nội dung. Sửa đúng cần thêm nút mở/đóng + overlay, tức là thêm UI mới chứ không chỉ sửa lỗi.
- **Không có route protection** ([4.2](#42-không-có-route-protection-)) — `(admin)/*` vẫn vào được không cần đăng nhập. Cần có trang login trước.

---

## Mục lục

1. [Bug — cần sửa ngay](#1-bug--cần-sửa-ngay)
2. [Code thừa / code chết — nên xoá](#2-code-thừa--code-chết--nên-xoá)
3. [Vấn đề thiết kế & kiến trúc](#3-vấn-đề-thiết-kế--kiến-trúc)
4. [Bảo mật](#4-bảo-mật)
5. [Hiệu năng & SSR](#5-hiệu-năng--ssr)
6. [Docker & CI/CD](#6-docker--cicd)
7. [Tooling & DX còn thiếu](#7-tooling--dx-còn-thiếu)
8. [Nâng cấp đề xuất](#8-nâng-cấp-đề-xuất)
9. [Kế hoạch thực thi theo thứ tự](#9-kế-hoạch-thực-thi-theo-thứ-tự)

---

## 1. Bug — cần sửa ngay

### 1.1. Access token không bao giờ được lưu sau khi login 🔴

`AuthService` gọi endpoint `/auth/login`, nhưng interceptor lại so khớp với chuỗi `/api/auth/login`. Hai chuỗi này không bao giờ khớp nhau.

- [src/core/service/auth.service.ts:9](src/core/service/auth.service.ts#L9) — `private readonly baseUrl = "/auth"` → URL thực tế là `/auth/login`
- [src/core/service/http-client.ts:173](src/core/service/http-client.ts#L173) — `if (url.includes("/api/auth/login"))`

Hệ quả: `setAccessTokenToLS()` không bao giờ chạy. User login thành công nhưng request tiếp theo vẫn không có header `Authorization`. Tương tự với `/api/auth/logout` → `clearLS()` không chạy.

Ngoài ra, **`refresh_token` không bao giờ được lưu ở bất cứ đâu**. Hàm `setRefreshTokenToLS()` được export nhưng không có nơi nào gọi ([src/core/utils/storage.ts:75](src/core/utils/storage.ts#L75)). Nghĩa là luồng refresh token ở [http-client.ts:884](src/core/service/http-client.ts#L884) sẽ luôn gửi chuỗi rỗng lên server.

**Cách sửa:** đừng dựa vào việc so khớp URL trong interceptor. Cho `AuthService.login()` tự lưu token sau khi nhận response — service biết rõ nó vừa gọi gì, interceptor thì không.

```ts
// auth.service.ts
async login(params: Account): Promise<LoginResponse> {
  const res = await httpClient.post<LoginResponse>(this.getEndpoint("/login"), params);
  setAccessTokenToLS(res.access_token);
  setRefreshTokenToLS(res.refresh_token);   // hiện tại đang thiếu hoàn toàn
  setUserToLS(res.user);
  return res;
}
```

Và xoá luôn `handleResponse()` khỏi http-client — bỏ được một trách nhiệm không thuộc về nó.

---

### 1.2. `global-error.tsx` sẽ crash khi được render 🔴

- [src/app/global-error.tsx:10](src/app/global-error.tsx#L10)

File này gọi `useLocale()` và `useTranslations("error")`. Nhưng theo thiết kế của Next.js, `global-error.tsx` **thay thế toàn bộ root layout** khi có lỗi — nghĩa là nó render bên ngoài `<AppProvider>`, và do đó bên ngoài `NextIntlClientProvider` (chỉ được mount trong [app-provider.tsx:41](src/components/providers/app-provider.tsx#L41), thuộc `[locale]/layout.tsx`).

Kết quả: khi một lỗi nghiêm trọng xảy ra, `useTranslations` throw `No intl context found` → error page của bạn cũng chết theo → user thấy trang trắng.

Đây là loại bug chỉ lộ ra đúng lúc bạn cần nó nhất.

**Cách sửa:** `global-error.tsx` phải là self-contained, hardcode text tiếng Anh (hoặc đọc locale từ cookie `NEXT_LOCALE` bằng tay), không dùng bất kỳ hook nào của next-intl.

Cùng file, dòng 30 hardcode `retryLabel="Làm mới trang"` trong khi các label khác đi qua `t()` — không nhất quán.

---

### 1.3. Circular import giữa `http-client` và `auth.service` 🔴

- [src/core/service/http-client.ts:11](src/core/service/http-client.ts#L11) — `import { authApi } from "@/core/service/auth.service"`
- [src/core/service/auth.service.ts:1](src/core/service/auth.service.ts#L1) — `import { httpClient } from "@/core/service/http-client"`

Vòng lặp A → B → A. Hiện tại code chạy được nhờ may mắn về thứ tự hoisting của module, nhưng nó rất dễ vỡ: chỉ cần đổi thứ tự import, bật một bundler khác, hoặc thêm code chạy ở top-level, `authApi` sẽ là `undefined` tại thời điểm `new HttpClient()` chạy ở [http-client.ts:1003](src/core/service/http-client.ts#L1003).

**Cách sửa:** http-client không nên biết về auth.service. Gọi refresh token bằng một axios instance riêng (không có interceptor), hoặc bằng `axios.post` trần:

```ts
// trong http-client, thay vì this.authService.refreshToken(...)
const { data } = await axios.post<LoginResponse>(
  `${API_URL}/auth/refresh-token`,
  {
    refresh_token: getRefreshTokenFromLS(),
  },
);
```

Cách này còn tránh được một bug tiềm ẩn: hiện tại `refreshToken()` đi qua chính `httpClient` — nếu request refresh trả 401 thì interceptor lại kích hoạt refresh lần nữa → nguy cơ đệ quy.

---

### 1.4. Dockerfile production đang chạy `pnpm dev` 🔴

- [Dockerfile](Dockerfile)
- [.github/workflows/ci.yml:26](.github/workflows/ci.yml#L26) — image này được push lên Docker Hub với tag `:latest`

```dockerfile
FROM node:22-alpine
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
CMD ["pnpm", "dev"]          # ← dev server, trong production image
EXPOSE 4040                   # ← đặt sau CMD
```

Vấn đề:

- Không có `next build` — image chạy dev server với hot reload, source map đầy đủ, không tối ưu. Chậm hơn production build nhiều lần.
- Single-stage → image chứa toàn bộ `node_modules` dev (eslint, prettier, typescript…). Dung lượng lớn gấp nhiều lần cần thiết.
- Chạy bằng `root`.
- `--ignore-scripts` chặn cả `sharp` build → tối ưu ảnh của Next sẽ không hoạt động (dù `pnpm-workspace.yaml` có `allowBuilds: sharp: true`).

**Cách sửa:** multi-stage build + `output: "standalone"` trong `next.config.ts`. Xem [mục 6](#6-docker--cicd) để có Dockerfile hoàn chỉnh.

---

### 1.5. `error.tsx` nhận `params` — nhưng Next.js không truyền `params` cho error boundary 🟠

- [src/app/[locale]/error.tsx:7](src/app/[locale]/error.tsx#L7) — `const locale = params?.locale || defaultLocale`
- [src/model/interface/error.interface.ts](src/model/interface/error.interface.ts) — `ErrorPageProps` khai báo `params?`

Next.js chỉ truyền `{ error, reset }` cho `error.tsx`. `params` **luôn luôn** `undefined` → `locale` luôn là `defaultLocale`. Và trớ trêu thay, `ErrorPageContent` nhận prop `locale` rồi… không dùng ([error-page-content.tsx:14](src/app/[locale]/_components/error-page-content.tsx#L14) chỉ destructure `{ error, reset }`).

Toàn bộ chuỗi truyền `locale` này là dead code. Nếu cần locale, dùng `useLocale()` từ next-intl (ở đây hợp lệ vì `error.tsx` nằm trong provider).

---

### 1.6. Khối `try/catch` quanh `t()` không bao giờ bắt được gì 🟠

- [src/app/[locale]/\_components/error-page-content.tsx:24-32](src/app/[locale]/_components/error-page-content.tsx#L24-L32)

```ts
try {
  title = t("title", { errorName });
  ...
} catch (translationError) {
  console.error("Translation error:", translationError);
}
```

`useTranslations` của next-intl **không throw** khi thiếu key — nó trả về chính key đó và log warning. Vậy nên `getFallbackErrorMessages()` không bao giờ được dùng đến, và cả hàm đó ([error.utils.ts:452](src/core/helpers/error.utils.ts#L452)) là code chết. Xoá cả try/catch lẫn hàm fallback.

---

### 1.7. `useClickOutside` re-subscribe listener mỗi lần render 🟡

- [src/hooks/use-click-outside.ts:29](src/hooks/use-click-outside.ts#L29) — `}, [handler])`

Mọi call-site đều truyền arrow function inline (`useClickOutside(() => setIsOpen(false))`), nên `handler` là reference mới ở mỗi render → `useEffect` gỡ và gắn lại 2 event listener trên `document` sau mỗi render. Không crash, nhưng lãng phí và là một anti-pattern kinh điển.

**Cách sửa:** giữ handler trong ref, để deps rỗng:

```ts
const handlerRef = useRef(handler);
handlerRef.current = handler;

useEffect(() => {
  const listener = (e: MouseEvent | TouchEvent) => {
    if (!ref.current || ref.current.contains(e.target as Node)) return;
    handlerRef.current();
  };
  document.addEventListener(CONSTANTS_MOUSE_DOWN, listener);
  document.addEventListener(CONSTANTS_TOUCH_START, listener);
  return () => {
    /* remove */
  };
}, []); // ← chạy đúng một lần
```

---

### 1.8. `getColorClasses` có thể trả về `undefined` 🟡

- [src/app/[locale]/(admin)/dashboard/page.tsx](<src/app/[locale]/(admin)/dashboard/page.tsx>) — `return colors[color]`

Index vào `Record<string, {...}>` với một `color: string` bất kỳ. TypeScript không cảnh báo vì `noUncheckedIndexedAccess` đang tắt. Chỉ cần ai đó thêm `color: "teal"` là runtime crash ở `.bg`.

Đổi tham số thành union type: `color: "blue" | "green" | "purple" | "orange"`.

---

### 1.9. `retryRequest` chỉ retry timeout, không retry lỗi mạng 🟡

- [src/core/service/http-client.ts:811](src/core/service/http-client.ts#L811)

```ts
isEqual(error.code, ECONNABORTED); // chỉ ECONNABORTED
```

Lỗi mạng thật (`ERR_NETWORK`, DNS fail, server 502/503) không được retry. Đồng thời, backoff hiện tại là tuyến tính (`1000 * retryCount` → 1s, 2s, 3s) chứ không phải exponential như comment nói. Nên retry cả `ERR_NETWORK` và status 502/503/504, với backoff thực sự exponential (`2 ** n * 1000`) và jitter.

---

<a id="110"></a>

### 1.10. Toàn bộ i18n phía server luôn dùng locale mặc định 🔴

_Bug này không có trong bản review đầu tiên — nó chỉ lộ ra khi tôi chạy thật server và curl `/en`._

- [src/app/i18n/request.ts](src/app/i18n/request.ts) — `getRequestConfig(async ({ locale }) => ...)`

Trong next-intl v4, callback của `getRequestConfig` nhận **`requestLocale`** (một `Promise<string | undefined>`) chứ không phải `locale`. Tham số `locale` chỉ được điền khi bạn tự truyền vào, kiểu `getTranslations({ locale: "en" })`.

Vì code đọc `locale`, nó **luôn** nhận `undefined` → `getSafeLocale(undefined)` → `defaultLocale` (`"vi"`). Nghĩa là mọi request, kể cả `/en/...`, đều nạp từ điển tiếng Việt vào request config.

Bug này bị che giấu vì `[locale]/layout.tsx` tự đọc `params.locale` rồi truyền messages xuống `NextIntlClientProvider`, nên nội dung trang vẫn hiển thị đúng ngôn ngữ. Chỉ những gì đọc request config mới sai — và trước khi thêm `lang={locale}` thì chưa có gì đọc nó, nên không ai thấy.

Cách phát hiện: `curl -s localhost:4143/en | grep 'lang='` → trả về `lang="vi"`.

**Đã sửa:** đổi sang `async ({ requestLocale })` và `await requestLocale`.

---

<a id="111"></a>

### 1.11. Menu con trong sidebar nhận `isOpen` của menu cha 🟠

_Cũng là bug mới, phát hiện khi đang gỡ `localOpen` ở [3.7](#37-menuitem-có-hai-nguồn-state-cho-cùng-một-thứ-)._

- `menu-item.tsx` — `isOpen={onToggle ? isOpen : undefined}` khi render children

`Sidebar` chỉ theo dõi `openMenuIds` cho menu cấp 0, còn `MenuItem` truyền thẳng `isOpen` của **chính nó** xuống mọi menu con. Kết quả: mở menu `Products` thì menu con `Categories` cũng tự mở theo, vì cả hai cùng đọc một biến.

**Đã sửa:** truyền cả `Set` `openMenuIds` xuống, mỗi `MenuItem` tự tra `openMenuIds.has(item.id)`. Đồng thời gỡ `localOpen` — dual state không còn cần nữa.

---

## 2. Code thừa / code chết — nên xoá

Mình đã grep toàn bộ `src/`. Các file dưới đây **không có bất kỳ import nào** từ nơi khác (số lần xuất hiện chỉ nằm trong chính file định nghĩa và file barrel `index.ts`).

### 2.1. File chết hoàn toàn — xoá được ngay

| File                                                                                                 | Ghi chú                                                                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [src/core/helpers/calculator.ts](src/core/helpers/calculator.ts)                                     | 0 import. Đây cũng là file **duy nhất** thực sự dùng `lodash`                               |
| [src/core/helpers/date-time.ts](src/core/helpers/date-time.ts)                                       | 0 import                                                                                    |
| [src/core/helpers/regex.ts](src/core/helpers/regex.ts)                                               | 0 import. 12 regex về ngân hàng / mã số thuế nhà cung cấp — rõ ràng là copy từ project khác |
| [src/core/helpers/validator.ts](src/core/helpers/validator.ts)                                       | 0 import. Trùng chức năng với `EMAIL_REGEX` trong `regex.ts`                                |
| [src/core/helpers/queries-key.ts](src/core/helpers/queries-key.ts)                                   | 0 import                                                                                    |
| [src/core/helpers/toaster.common.ts](src/core/helpers/toaster.common.ts)                             | 0 import — dù `<ToastContainer>` đã được mount                                              |
| [src/core/configs/query-key.ts](src/core/configs/query-key.ts)                                       | 0 import. Chứa `TRAVEL`, `DESTINATION`, `PLACE` — leftover từ project du lịch               |
| [src/core/configs/icon-size.ts](src/core/configs/icon-size.ts)                                       | 0 import                                                                                    |
| [src/core/constant/status-http.ts](src/core/constant/status-http.ts)                                 | 0 import. Code đang dùng `HttpStatusCode` của axios                                         |
| [src/core/store/feature/sidebar-toggle.zustand.ts](src/core/store/feature/sidebar-toggle.zustand.ts) | 0 import. Đây là **file duy nhất** dùng `zustand`                                           |
| [src/core/validation/index.ts](src/core/validation/index.ts)                                         | Chỉ có đúng 1 dòng comment `// Validation helpers`                                          |
| [src/hooks/use-query-params.ts](src/hooks/use-query-params.ts)                                       | 0 import                                                                                    |
| [src/model/interface/base-model.ts](src/model/interface/base-model.ts)                               | 0 import                                                                                    |
| [src/app/i18n/client.ts](src/app/i18n/client.ts)                                                     | 0 import. `useAppTranslations` chỉ là wrapper vô nghĩa quanh `useTranslations`              |

**Đặc biệt chú ý `sidebar-toggle.zustand.ts`:** store này tồn tại đúng để quản lý trạng thái collapse của sidebar, nhưng [admin-layout.tsx:21](src/components/layout/admin/admin-layout.tsx#L21) lại dùng `useState` cục bộ. Nghĩa là trạng thái sidebar **không được persist** dù store đã cấu hình `persist` middleware. Hoặc dùng store (và bỏ `useState` + prop drilling `isCollapsed` xuống 2 tầng), hoặc xoá hẳn store. Đừng để cả hai.

### 2.2. Symbol chết trong file còn dùng

- [src/core/configs/](src/core/configs/) — `isEmpty`, `isArray`, `isNull`, `isUndefined` được export nhưng chỉ `isEqual` là có người dùng (trong http-client). `isNull`/`isUndefined` từng được dùng bởi `use-query-params.ts` — mà file đó cũng chết.
- [src/core/utils/storage.ts](src/core/utils/storage.ts) — `setRefreshTokenToLS`, `getUserFromLocalStorage`, `setUserToLS`, `removeAccessTokenFromLS`, `LocalStorageEventTarget` đều 0 call-site. (Xem [1.1](#11-access-token-không-bao-giờ-được-lưu-sau-khi-login-) — `setRefreshTokenToLS` _đáng lẽ_ phải được gọi.)
- [src/core/helpers/consts.ts](src/core/helpers/consts.ts) — `EMPTY_STRING`, `EMPTY_WIDTH_400`, `ERROR_TYPE`, `DEFAULT_PAGE_SIZE`, `DEFAULT_PAGE_SIZE_OPTION`, `WIDTH_CONST`, `DEBOUNCE_TIME`, `NUMBER_CONSTANTS` — tất cả 0 call-site ngoài `calculator.ts` (cũng đã chết).
- [src/app/i18n/config/settings.ts](src/app/i18n/config/settings.ts) — `getLocaleFromPathname`, `removeLocaleFromPathname`, `getI18nPath` đều 0 call-site. `language-switcher.tsx` tự split path bằng tay thay vì dùng chúng.
- [src/model/common/type.ts](src/model/common/type.ts) — `PaginationParams`, `SortParams`, `ApiResponse`, `ApiError` đều 0 call-site.
- [src/components/layout/admin/types.ts](src/components/layout/admin/types.ts) — `SidebarState` 0 call-site.
- [src/model/interface/error.interface.ts](src/model/interface/error.interface.ts) — `ErrorInfo` 0 call-site (bị nhầm với `ErrorInfo` của React).
- [src/components/layout/admin/sidebar.tsx:15](src/components/layout/admin/sidebar.tsx#L15) — prop `locale` được khai báo, được truyền từ `AdminLayout`, nhưng bị bỏ qua khi destructure. Xoá khỏi cả interface lẫn call-site.

### 2.3. Dependency không dùng — gỡ khỏi `package.json`

Sau khi xoá code chết ở trên:

| Package                    | Lý do                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `zod`                      | 0 import trong toàn bộ `src/`                                                                                       |
| `react-hook-form`          | 0 import                                                                                                            |
| `@hookform/resolvers`      | 0 import                                                                                                            |
| `lodash` + `@types/lodash` | Chỉ dùng trong `calculator.ts` (chết). `@types/lodash` còn đang nằm nhầm ở `dependencies` thay vì `devDependencies` |
| `dayjs`                    | Chỉ dùng trong `date-time.ts` (chết) và 1 dòng `TIMEZONE_OFFSET` trong `consts.ts` (cũng không ai đọc)              |
| `zustand`                  | Chỉ dùng trong store sidebar (chết)                                                                                 |
| `react-toastify`           | `ToastContainer` có mount, nhưng `toastifyCommon` không ai gọi → chưa có toast nào được bắn ra                      |
| `@types/lint-staged`       | lint-staged không cần type ở runtime; config nằm trong `package.json` dạng JSON                                     |

Nếu bạn cố ý giữ chúng như "boilerplate sẵn sàng dùng", thì hãy **kèm ít nhất một ví dụ sử dụng** (một form login với `react-hook-form` + `zod`), nếu không người dùng boilerplate sẽ tưởng nó đã được wire sẵn.

### 2.4. Trùng lặp

- **Hai `QUERY_KEY` khác nhau** — [core/configs/query-key.ts](src/core/configs/query-key.ts) và [core/helpers/queries-key.ts](src/core/helpers/queries-key.ts). Cả hai đều chết, nhưng nếu giữ thì phải gộp làm một.
- **Hai regex email** — `EMAIL_REGEX` trong [regex.ts](src/core/helpers/regex.ts) và `validator.email` trong [validator.ts](src/core/helpers/validator.ts), với pattern khác nhau.
- **Hai theme toggle** — [client/\_components/theme-toggle.tsx](<src/app/[locale]/(client)/_components/theme-toggle.tsx>) (dùng `<Button>`, có animation, có `useMounted` guard) và một cái viết tay inline trong [header-admin.tsx:71-82](src/components/layout/admin/header-admin.tsx#L71-L82) (dùng `<button>` trần, không guard hydration → **sẽ gây hydration mismatch**). Dùng chung một component.
- **`error-view.tsx` vs `app-error-provider.tsx`** — hai UI hiển thị lỗi gần như trùng nhau, một cái i18n-hoá, một cái hardcode tiếng Việt.

### 2.5. Rác lặt vặt

- [src/app/not-found.tsx](src/app/not-found.tsx) — bọc `<NotFoundApp />` trong một Fragment thừa.
- [public/](public/) — `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` là asset mặc định của `create-next-app`, không component nào dùng.
- [.dockerignore](.dockerignore) — `.github` bị liệt kê hai lần (dòng "Git" và dòng "CI/CD").
- [next.config.ts:6](next.config.ts#L6) — comment placeholder `/* config options here */`.
- [src/components/layout/admin/menu-item.tsx](src/components/layout/admin/menu-item.tsx) — comment tiếng Việt lẫn trong code base tiếng Anh (`// Màu sắc chuyên nghiệp, không lòe loẹt`, `// Level 0 - Menu chính`). Các comment kiểu `// Level 1 - Menu cấp 2` chỉ nói lại đúng những gì dòng code bên dưới đã nói.

---

## 3. Vấn đề thiết kế & kiến trúc

### 3.1. `isEqual` tự viết có tên gây hiểu nhầm nghiêm trọng 🟠

- [src/core/configs/is-equal.ts](src/core/configs/is-equal.ts)

```ts
export const isEqual = (value1: unknown, value2: unknown): boolean =>
  value1 === value2;
```

Cả bộ `core/configs/` được giới thiệu là "custom function to replace lodash" ([ic-empty.ts:3](src/core/configs/ic-empty.ts#L3)). Nhưng `_.isEqual` của lodash là **so sánh sâu (deep equality)**. Cái này chỉ là `===`.

Bất kỳ ai từng dùng lodash — tức là gần như mọi dev JS — sẽ viết `isEqual(objA, objB)` và nhận `false` một cách im lặng, không có lỗi TypeScript nào (vì signature nhận `unknown`). Đây là loại bug rất khó truy.

Hiện `isEqual` chỉ được dùng trong http-client để so sánh number/string ([http-client.ts:817, 840, 844](src/core/service/http-client.ts#L817)), nơi mà `===` là đủ. **Hãy xoá abstraction này và viết `===` trực tiếp.** Ba dòng đó trở nên rõ ràng hơn hẳn:

```ts
error.code === ECONNABORTED;
error.response?.status === HttpStatusCode.Unauthorized;
```

Tương tự, `isArray = (v) => Array.isArray(v)`, `isNull = (v) => v === null`, `isUndefined = (v) => v === undefined` — cả ba đều là wrapper không thêm giá trị gì so với việc gọi thẳng. Chúng làm code khó đọc hơn (phải nhảy sang file khác để biết nó làm gì) và tốn một tầng import.

### 3.2. `DashboardTranslations` được viết tay và ép kiểu bằng `as unknown as` 🟠

Xuất hiện ở 5 chỗ:

- [(admin)/layout.tsx:19](<src/app/[locale]/(admin)/layout.tsx#L19>)
- [dashboard/page.tsx:14](<src/app/[locale]/(admin)/dashboard/page.tsx#L14>)
- [users/roles/page.tsx:13](<src/app/[locale]/(admin)/users/roles/page.tsx#L13>)
- [users/list/page.tsx](<src/app/[locale]/(admin)/users/list/page.tsx>)
- [analytics/page.tsx](<src/app/[locale]/(admin)/analytics/page.tsx>)

```ts
const t = translationsData.dashboard as unknown as DashboardTranslations;
```

`as unknown as X` là cách nói "tôi biết TypeScript không đồng ý, và tôi vẫn làm". Ở đây nó che đi việc [types.ts](src/components/layout/admin/types.ts) là bản chép tay 30 dòng của `dashboard.json`. Hai file này sẽ lệch nhau ngay lần đầu ai đó thêm key mới.

**Cách sửa:** suy ra type từ chính file JSON.

```ts
import type en from "@/app/i18n/dictionaries/en/dashboard.json";
export type DashboardTranslations = typeof en;
```

Và tốt hơn nữa: dùng **type-safe messages của next-intl** (`global.d.ts` với `declare interface AppConfig { Messages: typeof en }`), rồi gọi `useTranslations("dashboard")` như mọi nơi khác. Không cần truyền cả cây object dịch qua props.

### 3.3. Admin page tự fetch lại translations dù layout đã fetch 🟡

`(admin)/layout.tsx` gọi `getTranslations(locale, ["dashboard"])`, rồi từng page (`dashboard`, `analytics`, `users/list`, `users/roles`) lại gọi y hệt. Bốn lần đọc + parse cùng một tập JSON cho một lần render trang.

Nguyên nhân sâu xa: bạn đang truyền translations bằng props thay vì dùng `NextIntlClientProvider` + `useTranslations` / `getTranslations` của next-intl. Điều này cũng dẫn tới prop drilling `translations` xuống `AdminLayout` → `Sidebar` → `MenuItem`, và `AdminLayout` → `HeaderAdmin`.

### 3.4. `loadAllTranslations` load tuần tự 6 namespace 🟡

- [src/app/i18n/utils/loader.ts:18-26](src/app/i18n/utils/loader.ts#L18-L26)

```ts
for (const namespace of namespaces) {
  translations[namespace] = await import(`../dictionaries/${locale}/${namespace}.json`)...
}
```

Sáu lần `await` nối tiếp nhau. Dùng `Promise.all` để chạy song song:

```ts
const entries = await Promise.all(
  namespaces.map(
    async (ns) =>
      [
        ns,
        (await import(`../dictionaries/${locale}/${ns}.json`)).default,
      ] as const,
  ),
);
return Object.fromEntries(entries);
```

Tệ hơn: `loadTranslations(locale, ["dashboard"])` gọi `loadAllTranslations()` rồi **lọc bỏ** 5 namespace vừa load ([loader.ts:34](src/app/i18n/utils/loader.ts#L34)). Không tiết kiệm được gì, chỉ tạo cảm giác là có.

### 3.5. `AdminLayout` bọc `Sidebar` nhưng sidebar không responsive 🟡

- [src/components/layout/admin/sidebar.tsx](src/components/layout/admin/sidebar.tsx) — `fixed left-0 ... w-64` không có breakpoint
- [src/components/layout/admin/admin-layout.tsx:34](src/components/layout/admin/admin-layout.tsx#L34) — content dùng `md:pl-64`

Trên màn hình `< md`, sidebar vẫn `fixed` chiếm 256px nhưng content **không** có padding-left → sidebar đè lên nội dung. Không có nút mở/đóng cho mobile, không có overlay/backdrop. Admin layout hiện tại chỉ dùng được trên desktop.

### 3.6. `header-admin.tsx` import component từ route group khác 🟡

- [src/components/layout/admin/header-admin.tsx:16](src/components/layout/admin/header-admin.tsx#L16)

```ts
import { LanguageSwitcher } from "@/app/[locale]/(client)/_components/language-switcher";
```

Quy ước `_components` trong App Router có nghĩa là "private, thuộc về route này". Import xuyên từ `(admin)` sang `(client)` phá vỡ ranh giới đó. `LanguageSwitcher`, `ThemeToggle` là component dùng chung → chuyển sang `src/components/common/` hoặc `src/components/ui/`.

### 3.7. `MenuItem` có hai nguồn state cho cùng một thứ 🟡

- [src/components/layout/admin/menu-item.tsx:23-46](src/components/layout/admin/menu-item.tsx#L23-L46)

Component vừa có `localOpen` (useState) vừa nhận `isOpen` + `onToggle` từ cha, rồi chọn cái nào tuỳ `onToggle` có được truyền hay không. Đây là "controlled/uncontrolled hybrid" — hợp lý cho một component thư viện public, nhưng đây là component nội bộ và **luôn** được gọi với `onToggle` từ `Sidebar`. `localOpen` là code chết.

Ngoài ra `Sidebar` chỉ track `openMenuIds` cho menu **level 0**; menu level 1 có children (như `categories`) sẽ rơi vào nhánh `localOpen` — nên state của chúng thực ra không được quản lý nhất quán.

### 3.8. `handleRequest` phá cấu trúc `AxiosHeaders` 🟡

- [src/core/service/http-client.ts:781](src/core/service/http-client.ts#L781)

```ts
config.headers = { ...config.headers, Authorization: `...` };
```

`config.headers` trong interceptor là instance của `AxiosHeaders` (có method `.set()`, `.get()`…). Spread nó thành plain object làm mất các method đó — đó chính là lý do dòng [733](src/core/service/http-client.ts#L733) phải ép kiểu `as InternalAxiosRequestConfig`. Dùng `config.headers.set("Authorization", ...)` và bỏ ép kiểu.

### 3.9. `<html>` root thiếu `lang` 🟡

- [src/app/layout.tsx:22](src/app/layout.tsx#L22) — `<html suppressHydrationWarning ...>`

Không có `lang`. Đây là lỗi a11y (screen reader không biết đọc ngôn ngữ gì) và ảnh hưởng SEO. Với setup i18n hiện tại, cần đặt `lang={locale}` — nghĩa là `<html>` phải nằm trong `[locale]/layout.tsx`, hoặc root layout phải đọc locale.

Nghịch lý là [global-error.tsx:20](src/app/global-error.tsx#L20) **có** `lang={locale}`, còn layout chính thì không.

### 3.10. `now={new Date()}` trong client component gây hydration mismatch 🟡

- [src/components/providers/app-provider.tsx:44](src/components/providers/app-provider.tsx#L44)

`AppProvider` là `"use client"`. `new Date()` sẽ cho giá trị khác giữa server render và client hydrate. Với `next-intl`, giá trị `now` nên đến từ server (nó đã được set trong [request.ts:15](src/app/i18n/request.ts#L15)) và không cần truyền lại ở client.

### 3.11. `ErrorContent` render `<span>` bên trong `<p>` để xuống dòng 🟢

- [src/components/ui/error/error-content.tsx:36-44](src/components/ui/error/error-content.tsx#L36-L44)

Tách message theo `\n` rồi map ra `<span>` + `<br>`, đồng thời gọi `message.split("\n")` ba lần. Dùng CSS `whitespace-pre-line` là xong, không cần JS.

### 3.12. Placeholder / demo data còn sót 🟢

- [header-admin.tsx:29](src/components/layout/admin/header-admin.tsx#L29) — `searchQuery` được set nhưng không có hành động search nào.
- [header-admin.tsx:32](src/components/layout/admin/header-admin.tsx#L32) — `handleLogout = () => console.log("Logout clicked")`.
- [header-admin.tsx:30](src/components/layout/admin/header-admin.tsx#L30) — `hasNotifications` hardcode `true`; danh sách thông báo là `[1,2,3].map(...)` với nội dung cứng "New user registered".
- Avatar "AD" / "admin@example.com" hardcode.
- `dashboard/page.tsx`, `users/roles/page.tsx`, `users/list/page.tsx`, `analytics/page.tsx` — toàn bộ dữ liệu là mock inline trong component.
- [menu-config.tsx](src/components/layout/admin/menu-config.tsx) — `"Main Categories"` / `"Sub Categories"` hardcode tiếng Anh giữa các label đã i18n-hoá. Menu trỏ tới `/products/*`, `/orders`, `/reports/*`, `/settings/*` — **những route này không tồn tại** → click vào là 404.

Với boilerplate thì demo data là chấp nhận được, nhưng nên tách ra `*.mock.ts` và ghi rõ trong README để người dùng biết chỗ cần thay.

---

## 4. Bảo mật

### 4.1. Token lưu trong `localStorage` 🟠

- [src/core/utils/storage.ts](src/core/utils/storage.ts)

`access_token` và `refresh_token` nằm trong `localStorage` → bất kỳ script XSS nào cũng đọc được (`localStorage` không có cơ chế bảo vệ nào). Đây là điểm khác biệt then chốt so với cookie `httpOnly`, thứ mà JS không đọc được.

Với Next.js App Router, lựa chọn đúng là **cookie `httpOnly` + `Secure` + `SameSite=Lax`**, đặt qua Route Handler hoặc Server Action. Bonus: middleware/proxy có thể đọc cookie để bảo vệ route, điều mà `localStorage` không làm được.

Nếu bắt buộc phải giữ localStorage (vd. backend không set cookie được), hãy ghi rõ trade-off này trong README — người dùng boilerplate cần biết họ đang chấp nhận rủi ro gì.

### 4.2. Không có route protection 🟠

- [src/proxy.ts](src/proxy.ts) chỉ chạy `createMiddleware` của next-intl.

Toàn bộ `(admin)/*` — dashboard, users, analytics — **truy cập được mà không cần đăng nhập**. Không có middleware check auth, không có server-side guard, không có redirect về `/login` (mà trang login cũng chưa tồn tại).

Với một boilerplate có sẵn `auth.service.ts` và một admin layout hoàn chỉnh, đây là thứ người dùng sẽ mặc định là "đã có".

### 4.3. `NEXT_PUBLIC_API_URL` không được kiểm tra 🟡

- [src/core/service/http-client.ts:654](src/core/service/http-client.ts#L654) — `const API_URL = process.env.NEXT_PUBLIC_API_URL;`
- Dòng [716](src/core/service/http-client.ts#L716) — `baseURL: API_URL ?? ""`

Nếu quên set biến môi trường, mọi request sẽ đi tới chính origin của app (`baseURL: ""`) và fail một cách khó hiểu. Không có `.env.example` trong repo, không có nơi nào document biến này.

**Đề xuất:** thêm `.env.example` + validate env bằng zod lúc khởi động (`zod` đã có sẵn trong `package.json` — đây là chỗ dùng nó rất hợp lý).

```ts
// src/core/configs/env.ts
import { z } from "zod";
export const env = z
  .object({
    NEXT_PUBLIC_API_URL: z.url(),
  })
  .parse({ NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });
```

### 4.4. `handleLogout` gọi API logout mà không gửi refresh token 🟡

- [src/core/service/http-client.ts:932](src/core/service/http-client.ts#L932) — `await this.authService.logout()`

`logout(refreshToken?)` chấp nhận tham số optional, nhưng ở đây gọi rỗng → server không biết token nào cần revoke. Refresh token cũ vẫn còn hiệu lực trên server sau khi user "đăng xuất".

---

## 5. Hiệu năng & SSR

### 5.1. `AppError` và `NotFoundApp` trả về `null` cho tới khi mounted 🟠

- [src/components/providers/app-error-provider.tsx:39](src/components/providers/app-error-provider.tsx#L39) — `if (!mounted) return null;`
- [src/components/ui/not-found-app.tsx:11](src/components/ui/not-found-app.tsx#L11) — `if (!mounted) return null;`

Hệ quả:

- Trang 404 **không có nội dung nào trong HTML server-render**. Crawler thấy trang trắng. Đây là vấn đề SEO thực sự cho một trang 404.
- Người dùng thấy màn hình trắng rồi nội dung "nhảy" vào sau khi JS load.
- Nếu JS fail (đúng lúc trang lỗi đang cố hiển thị!) → không bao giờ có nội dung.

`useMounted` chỉ cần thiết cho phần thực sự phụ thuộc client (ví dụ `theme` từ `next-themes`). Ở đây không có gì như vậy — `framer-motion` render bình thường trên server. Bỏ guard, hoặc chỉ bọc riêng phần animation.

### 5.2. `theme-toggle` trong `header-admin` thiếu hydration guard 🟠

- [src/components/layout/admin/header-admin.tsx:78](src/components/layout/admin/header-admin.tsx#L78) — `{theme === "dark" ? <Sun/> : <Moon/>}`

`useTheme()` trả `undefined` trên server nhưng có giá trị thật sau hydrate → **hydration mismatch được đảm bảo**. Bản trong `(client)/_components/theme-toggle.tsx` đã xử lý đúng bằng `useMounted`. Đây là lý do nữa để gộp hai component lại.

### 5.3. `landing page` là `"use client"` toàn bộ 🟡

- [src/app/[locale]/(client)/page.tsx:1](<src/app/[locale]/(client)/page.tsx#L1>)

Trang chủ đánh dấu `"use client"` chỉ để render 6 section — và các section đó tự chúng đã là client component. Bản thân `page.tsx` không dùng hook nào. Bỏ `"use client"` khỏi page để nó thành Server Component; các section vẫn là client như cũ. Giảm được một chút JS ban đầu.

Xa hơn: `framer-motion` được import trong 16 file. Nó khá nặng (~50KB gzip). Với các animation đơn giản (fade-in, slide-up) trong landing page, CSS animation hoặc `motion/react` (bản mới nhẹ hơn) là đủ.

### 5.4. `QueryClient` cấu hình `retry: false` toàn cục 🟢

- [src/components/providers/provider-query.tsx:14](src/components/providers/provider-query.tsx#L14)

Tắt retry cho _mọi_ query. Với lỗi mạng tạm thời, người dùng sẽ thấy lỗi ngay lập tức thay vì được thử lại. Cân nhắc `retry: 1` hoặc một hàm retry bỏ qua lỗi 4xx. Cũng nên set `staleTime` (mặc định `0` → refetch rất thường xuyên).

### 5.5. Không có `loading.tsx` / streaming 🟢

Các admin page đều `async` (await `params`, await `getTranslations`) nhưng không có `loading.tsx` nào trong `[locale]/` hay `(admin)/`. Người dùng không thấy gì trong lúc chờ.

---

## 6. Docker & CI/CD

### 6.1. Dockerfile — viết lại

Xem [1.4](#14-dockerfile-production-đang-chạy-pnpm-dev-) cho các vấn đề. Đề xuất multi-stage:

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=4040
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 4040
CMD ["node", "server.js"]
```

Kèm theo, bật standalone output:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
};
```

Lưu ý: `NEXT_PUBLIC_*` được **inline lúc build**, nên `NEXT_PUBLIC_API_URL` phải truyền vào stage `builder` qua `ARG`, không phải lúc `docker run`.

### 6.2. CI không chạy lint, typecheck, hay test

- [.github/workflows/ci.yml](.github/workflows/ci.yml)

Workflow duy nhất chỉ build và push Docker image lên `:latest` mỗi khi có push vào `develop`. Không có gate nào cả:

- Không chạy `eslint`
- Không chạy `tsc --noEmit` (hiện tại **không có script nào** cho việc này trong `package.json`)
- Không có test (vì chưa có test)
- Không chạy trên pull request → PR có thể merge với code không compile được
- Không cache pnpm store

Đề xuất tách 2 job: `quality` (lint + typecheck + test, chạy trên cả PR) và `docker` (chỉ chạy trên `develop`, `needs: quality`).

Ngoài ra, image tag `:latest` được đẩy từ branch `develop` — nếu ai đó `docker pull …:latest` cho production thì họ đang lấy code develop. Nên gắn `:latest` với branch production, còn develop dùng tag `:develop`.

### 6.3. Thiếu script cơ bản

`package.json` hiện có: `dev`, `build`, `start`, `lint`, `prepare`. Nên bổ sung:

```json
"typecheck": "tsc --noEmit",
"lint:fix": "eslint --fix",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

Lưu ý `lint-staged` đang gọi `eslint --fix --max-warnings=0` nhưng script `lint` thì không có `--max-warnings=0` → CI và pre-commit hook áp dụng tiêu chuẩn khác nhau.

---

## 7. Tooling & DX còn thiếu

| Thiếu                                                 | Vì sao cần                                                                                                                                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Test** (Vitest + Testing Library, Playwright)       | 0 test file trong repo. Với logic phức tạp như refresh-token queue trong `http-client.ts`, không có test là rất rủi ro                                                                                             |
| `.env.example`                                        | Không ai biết cần set biến gì để chạy                                                                                                                                                                              |
| `tsc --noEmit` trong CI                               | Xem [6.2](#62-ci-không-chạy-lint-typecheck-hay-test)                                                                                                                                                               |
| `eslint-plugin-import` / `simple-import-sort`         | Thứ tự import hiện đang lộn xộn (so sánh [language-switcher.tsx](<src/app/[locale]/(client)/_components/language-switcher.tsx>) với [error-page-content.tsx](src/app/[locale]/_components/error-page-content.tsx)) |
| `eslint-config-prettier`                              | Chưa có → eslint và prettier có thể cãi nhau về format                                                                                                                                                             |
| `robots.ts` / `sitemap.ts`                            | Landing page public mà không có                                                                                                                                                                                    |
| `metadataBase`, `openGraph`, `twitter` trong metadata | [layout.tsx:16](src/app/layout.tsx#L16) chỉ có `title` + `description` giống hệt nhau                                                                                                                              |
| `.editorconfig`                                       | Đảm bảo nhất quán giữa các IDE                                                                                                                                                                                     |
| `renovate.json` / dependabot                          | Boilerplate cần cập nhật dep thường xuyên                                                                                                                                                                          |
| `CONTRIBUTING.md`, `LICENSE`                          | Repo public thiếu license                                                                                                                                                                                          |

### tsconfig có thể chặt hơn

- [tsconfig.json:3](tsconfig.json#L3) — `"target": "ES2017"` khá cũ. Next 16 yêu cầu Node 20+; `ES2022` an toàn và cho phép dùng `.at()`, class fields, top-level await.
- Nên bật thêm:
  - `noUncheckedIndexedAccess: true` → sẽ bắt được ngay bug [1.8](#18-getcolorclasses-có-thể-trả-về-undefined-)
  - `noUnusedLocals`, `noUnusedParameters` → sẽ bắt được prop `locale` không dùng trong `Sidebar`
  - `verbatimModuleSyntax: true` → ép dùng `import type` nhất quán (hiện đang lúc có lúc không)

---

## 8. Nâng cấp đề xuất

Ngoài việc sửa lỗi, đây là những thứ sẽ làm boilerplate này thực sự "sẵn sàng dùng":

1. **Auth flow hoàn chỉnh** — trang login/register dùng `react-hook-form` + `zod` (đã cài sẵn, chưa dùng), cookie `httpOnly`, middleware bảo vệ `(admin)/*`. Đây là thứ thiếu lớn nhất, vì mọi mảnh ghép đã có nhưng không nối với nhau.

2. **`next-intl` type-safe messages** — khai báo `AppConfig["Messages"]` để `t("...")` được autocomplete và báo lỗi khi sai key. Xoá được toàn bộ `as unknown as` ở [3.2](#32-dashboardtranslations-được-viết-tay-và-ép-kiểu-bằng-as-unknown-as-).

3. **Kiểm tra dịch thiếu** — hiện `vi/` và `en/` có thể lệch key mà không ai biết. Một script CI so sánh key giữa các locale sẽ chặn được.

4. **`Link` từ `next-intl/navigation`** — thay vì tự nối chuỗi locale vào path như [language-switcher.tsx:28-31](<src/app/[locale]/(client)/_components/language-switcher.tsx#L28-L31>) (`pathname.split("/")` rồi gán `segments[1]`). Cách hiện tại sẽ hỏng nếu `localePrefix` đổi sang `as-needed`.

5. **`generateStaticParams`** cho `[locale]` → cho phép Next prerender cả 2 ngôn ngữ lúc build.

6. **Tách demo data ra khỏi component** — `src/app/[locale]/(admin)/**/*.mock.ts`, kèm comment `// TODO: replace with real API call`.

7. **Storybook hoặc ít nhất một trang `/kitchen-sink`** — boilerplate có `Button`, `DropdownMenu`, các error view; nên có chỗ xem chúng.

8. **`react-error-boundary` v6 + `onReset`** — hiện `ErrorBoundary` có `onError` nhưng không có `onReset`/`resetKeys`, nên sau khi bấm "Thử lại" mà lỗi đến từ state cũ thì nó sẽ lỗi lại ngay.

9. **Bundle analyzer** (`@next/bundle-analyzer`) — với `framer-motion` xuất hiện ở 16 file, rất đáng để nhìn xem bundle đang thế nào.

10. **Instrumentation / error reporting** (Sentry, hoặc `instrumentation.ts`) — hiện `logErrorDetails()` chỉ `console.error`, tức là trên production không ai thấy gì.

---

## 9. Kế hoạch thực thi theo thứ tự

Sắp xếp theo tỉ lệ **giá trị / công sức**. Các bước đầu gần như không có rủi ro.

### Đợt 1 — Sửa bug (nửa ngày)

- [x] Sửa lưu token: chuyển vào `AuthService.login()`, thêm `setRefreshTokenToLS()` ([1.1](#11-access-token-không-bao-giờ-được-lưu-sau-khi-login-))
- [x] Gỡ circular import `http-client` ↔ `auth.service` ([1.3](#13-circular-import-giữa-http-client-và-authservice-))
- [x] Làm `global-error.tsx` self-contained, bỏ hook next-intl ([1.2](#12-global-errortsx-sẽ-crash-khi-được-render-))
- [x] Thêm `useMounted` guard cho theme toggle trong `header-admin` — hoặc tốt hơn, dùng chung `<ThemeToggle>` ([5.2](#52-theme-toggle-trong-header-admin-thiếu-hydration-guard-))
- [x] Bỏ `if (!mounted) return null` trong `NotFoundApp` và `AppError` ([5.1](#51-apperror-và-notfoundapp-trả-về-null-cho-tới-khi-mounted-))
- [x] Sửa `useClickOutside` deps ([1.7](#17-useclickoutside-re-subscribe-listener-mỗi-lần-render-))
- [x] Xoá `params` khỏi `ErrorPageProps` và try/catch chết trong `error-page-content.tsx` ([1.5](#15-errortsx-nhận-params--nhưng-nextjs-không-truyền-params-cho-error-boundary-), [1.6](#16-khối-trycatch-quanh-t-không-bao-giờ-bắt-được-gì-))

### Đợt 2 — Dọn code chết (1–2 giờ, rủi ro gần như bằng 0)

- [x] Xoá 14 file ở [2.1](#21-file-chết-hoàn-toàn--xoá-được-ngay)
- [x] Xoá `core/configs/*` (`isEqual`, `isArray`, `isNull`, `isUndefined`, `isEmpty`), thay bằng toán tử gốc ([3.1](#31-isequal-tự-viết-có-tên-gây-hiểu-nhầm-nghiêm-trọng-))
- [x] Dọn `consts.ts` — giữ lại `TIME_ZONE`, `COOKIE_*`, `CONSTANTS_MOUSE_DOWN/TOUCH_START`; xoá phần còn lại
- [x] Xoá asset mặc định trong `public/`
- [x] Gỡ dependency không dùng ([2.3](#23-dependency-không-dùng--gỡ-khỏi-packagejson)) — **hoặc** giữ và thêm ví dụ dùng
- [x] Xoá prop `locale` không dùng của `Sidebar`, `localOpen` của `MenuItem`
- [x] `pnpm dedupe && pnpm install`

Chạy `pnpm build && pnpm lint` sau bước này để chắc chắn không xoá nhầm.

### Đợt 3 — Docker & CI (nửa ngày)

- [x] `output: "standalone"` + Dockerfile multi-stage ([6.1](#61-dockerfile--viết-lại))
- [x] Tách CI job `quality` (lint + typecheck), chạy trên PR ([6.2](#62-ci-không-chạy-lint-typecheck-hay-test))
- [x] Thêm script `typecheck`, `format` ([6.3](#63-thiếu-script-cơ-bản))
- [x] Thêm `.env.example`

### Đợt 4 — Kiến trúc (1–2 ngày)

- [ ] Chuyển `DashboardTranslations` sang `typeof en` hoặc type-safe next-intl ([3.2](#32-dashboardtranslations-được-viết-tay-và-ép-kiểu-bằng-as-unknown-as-))
- [ ] Bỏ prop drilling translations, dùng `useTranslations` trong admin components ([3.3](#33-admin-page-tự-fetch-lại-translations-dù-layout-đã-fetch-))
- [ ] `Promise.all` trong `loadAllTranslations` ([3.4](#34-loadalltranslations-load-tuần-tự-6-namespace-))
- [ ] Chuyển `LanguageSwitcher` / `ThemeToggle` sang `components/common/` ([3.6](#36-header-admintsx-import-component-từ-route-group-khác-))
- [ ] Quyết định: dùng zustand store cho sidebar, hay xoá store
- [ ] Sidebar responsive cho mobile ([3.5](#35-adminlayout-bọc-sidebar-nhưng-sidebar-không-responsive-))
- [ ] `lang={locale}` trên `<html>` ([3.9](#39-html-root-thiếu-lang-))

### Đợt 5 — Tính năng còn thiếu (nhiều ngày)

- [ ] Auth flow: login page, cookie `httpOnly`, middleware guard ([4.1](#41-token-lưu-trong-localstorage-), [4.2](#42-không-có-route-protection-))
- [ ] Setup test (Vitest + Playwright), viết test cho `http-client` refresh queue trước tiên
- [ ] Metadata / SEO: `metadataBase`, `openGraph`, `robots.ts`, `sitemap.ts`
- [ ] Error reporting cho production

---

## Ghi chú cuối

Điểm mạnh của codebase này: cấu trúc thư mục rõ ràng, tách `core/` — `components/` — `app/` hợp lý, `http-client` có xử lý refresh-token queue khá chỉn chu (ý tưởng đúng, chỉ vướng circular import), i18n tách namespace tốt, error boundary phân tầng đầy đủ.

Điểm yếu chính không nằm ở kiến trúc mà ở chỗ **nhiều thứ được viết ra nhưng chưa bao giờ được nối vào**: store zustand không dùng, toast helper không dùng, `zod`/`react-hook-form` cài mà không có form nào, `setRefreshTokenToLS` viết mà không gọi, `getI18nPath` viết mà `language-switcher` lại tự split chuỗi. Với một boilerplate, khoảng cách giữa "có file" và "chạy được" là thứ người dùng sẽ vấp phải đầu tiên — và họ sẽ mất niềm tin vào toàn bộ những phần còn lại.

Ưu tiên **Đợt 1 + Đợt 2**: sửa 4 bug thật và xoá những gì không dùng. Sau hai đợt đó, codebase sẽ nhỏ hơn đáng kể và mọi thứ còn lại đều là thứ thực sự chạy.
