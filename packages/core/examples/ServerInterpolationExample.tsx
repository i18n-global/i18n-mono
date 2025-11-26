/**
 * Server Component Variable Interpolation Example
 *
 * This example demonstrates how to use variable interpolation
 * in Next.js Server Components with i18nexus.
 */

import { createServerI18n } from "i18nexus/server";

// Example translations (in a real app, these would be in separate JSON files)
const translations = {
  en: {
    "Hello {{name}}": "Hello {{name}}",
    "You have {{count}} messages": "You have {{count}} messages",
    "Views: {{views}} | Comments: {{comments}}":
      "Views: {{views}} | Comments: {{comments}}",
    "Price: {{price}} ({{discount}}% off)":
      "Price: ${{price}} ({{discount}}% off)",
    "Last updated {{hours}} hours ago": "Last updated {{hours}} hours ago",
  },
  ko: {
    "Hello {{name}}": "안녕하세요 {{name}}님",
    "You have {{count}} messages": "{{count}}개의 메시지가 있습니다",
    "Views: {{views}} | Comments: {{comments}}":
      "조회수: {{views}} | 댓글: {{comments}}개",
    "Price: {{price}} ({{discount}}% off)":
      "가격: {{price}}원 ({{discount}}% 할인)",
    "Last updated {{hours}} hours ago": "{{hours}}시간 전에 업데이트됨",
  },
};

// Example 1: Basic Server Component
export async function WelcomeMessage() {
  const { t } = await createServerI18n({ translations });
  const userName = "John Doe";

  return (
    <div>
      <h1>{t("Hello {{name}}", { name: userName })}</h1>
    </div>
  );
}

// Example 2: Blog Post with Dynamic Data
interface Post {
  id: string;
  title: string;
  views: number;
  comments: number;
  updatedHours: number;
}

async function fetchPost(id: string): Promise<Post> {
  // Simulate API call
  return {
    id,
    title: "Example Post",
    views: 1234,
    comments: 45,
    updatedHours: 2,
  };
}

export async function BlogPost({ postId }: { postId: string }) {
  const { t } = await createServerI18n({ translations });
  const post = await fetchPost(postId);

  return (
    <article>
      <h2>{post.title}</h2>
      <div style={{ color: "#666", fontSize: "14px" }}>
        {t("Views: {{views}} | Comments: {{comments}}", {
          views: post.views,
          comments: post.comments,
        })}
        <br />
        {t("Last updated {{hours}} hours ago", { hours: post.updatedHours })}
      </div>
    </article>
  );
}

// Example 3: Product List
interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
}

async function fetchProducts(): Promise<Product[]> {
  // Simulate API call
  return [
    { id: "1", name: "Product 1", price: 100, discount: 20 },
    { id: "2", name: "Product 2", price: 200, discount: 15 },
    { id: "3", name: "Product 3", price: 150, discount: 10 },
  ];
}

export async function ProductList() {
  const { t } = await createServerI18n({ translations });
  const products = await fetchProducts();

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong>
            <br />
            {t("Price: {{price}} ({{discount}}% off)", {
              price: product.price,
              discount: product.discount,
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 4: Notification Count
export async function NotificationHeader({ userId }: { userId: string }) {
  const { t } = await createServerI18n({ translations });

  // Simulate fetching unread count
  const unreadCount = 5;

  return (
    <header>
      <nav>
        <span>Notifications</span>
        {unreadCount > 0 && (
          <span style={{ marginLeft: "8px", color: "red" }}>
            {t("You have {{count}} messages", { count: unreadCount })}
          </span>
        )}
      </nav>
    </header>
  );
}

// Example 5: Complete Page Component
export async function ServerPage() {
  const { t, language } = await createServerI18n({ translations });
  const userName = "홍길동";
  const messageCount = 3;

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Server Component Interpolation Example</h1>
      <p>Current Language: {language}</p>

      <section style={{ marginBottom: "40px" }}>
        <h2>Welcome Section</h2>
        <p>{t("Hello {{name}}", { name: userName })}</p>
        <p>{t("You have {{count}} messages", { count: messageCount })}</p>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <BlogPost postId="123" />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <ProductList />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <NotificationHeader userId="user-123" />
      </section>
    </div>
  );
}

/**
 * Usage in Next.js App Router:
 *
 * // app/page.tsx
 * import { ServerPage } from '@/examples/ServerInterpolationExample';
 *
 * export default async function Page() {
 *   return <ServerPage />;
 * }
 *
 *
 * Note: Server Components with variable interpolation provide:
 * - Smaller JavaScript bundle (no React Context sent to client)
 * - Faster initial page load (translations rendered on server)
 * - Better SEO (fully rendered HTML)
 * - Zero hydration mismatch
 *
 * However, they cannot:
 * - Apply styles to variables (returns string only)
 * - Switch languages dynamically (requires page reload)
 *
 * Use Client Components (with useTranslation) when you need:
 * - Dynamic language switching
 * - Styled variables
 * - Interactive translations
 */

export default ServerPage;
