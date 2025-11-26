/**
 * Variable Interpolation Example
 *
 * This example demonstrates how to use variable interpolation
 * with i18nexus in both Client and Server Components.
 */

"use client";
import React from "react";
import { useTranslation, I18nProvider } from "i18nexus";

// Example translations
const translations = {
  en: {
    "Hello {{name}}": "Hello {{name}}",
    "You have {{count}} messages": "You have {{count}} messages",
    "Price: {{price}} ({{discount}}% off)":
      "Price: ${{price}} ({{discount}}% off)",
    "Order total: {{total}}": "Order total: ${{total}}",
  },
  ko: {
    "Hello {{name}}": "안녕하세요 {{name}}님",
    "You have {{count}} messages": "{{count}}개의 메시지가 있습니다",
    "Price: {{price}} ({{discount}}% off)":
      "가격: {{price}}원 ({{discount}}% 할인)",
    "Order total: {{total}}": "주문 합계: {{total}}원",
  },
};

// Example 1: Basic Variable Interpolation
function BasicInterpolation() {
  const { t } = useTranslation();
  const userName = "John Doe";

  return (
    <div>
      <h2>Basic Interpolation</h2>
      <p>{t("Hello {{name}}", { name: userName })}</p>
    </div>
  );
}

// Example 2: Multiple Variables
function MultipleVariables() {
  const { t } = useTranslation();
  const messageCount = 5;

  return (
    <div>
      <h2>Multiple Variables</h2>
      <p>{t("You have {{count}} messages", { count: messageCount })}</p>
      <p>
        {t("Price: {{price}} ({{discount}}% off)", {
          price: 100,
          discount: 20,
        })}
      </p>
    </div>
  );
}

// Example 3: Styled Variables
function StyledVariables() {
  const { t } = useTranslation();
  const orderTotal = 15000;

  return (
    <div>
      <h2>Styled Variables</h2>
      <p>
        {t(
          "Order total: {{total}}",
          { total: orderTotal },
          {
            total: {
              fontSize: "1.5em",
              fontWeight: "bold",
              color: "red",
            },
          }
        )}
      </p>
    </div>
  );
}

// Example 4: Shopping Cart Component
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function ShoppingCart() {
  const { t } = useTranslation();

  const items: CartItem[] = [
    { id: 1, name: "Product 1", price: 10000, quantity: 2 },
    { id: 2, name: "Product 2", price: 20000, quantity: 1 },
  ];

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      <h2>Shopping Cart</h2>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            {item.name} -{" "}
            {t("Price: {{price}} ({{discount}}% off)", {
              price: item.price,
              discount: 10,
            })}
          </div>
        ))}
      </div>
      <hr />
      <p>{t("You have {{count}} messages", { count: itemCount })}</p>
      <p>
        {t(
          "Order total: {{total}}",
          { total: totalPrice },
          {
            total: {
              fontSize: "1.2em",
              fontWeight: "bold",
              color: "green",
            },
          }
        )}
      </p>
    </div>
  );
}

// Example 5: Dynamic Notification Badge
function NotificationBadge({ unreadCount }: { unreadCount: number }) {
  const { t } = useTranslation();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      🔔
      {t(
        "{{count}}",
        { count: unreadCount },
        {
          count: {
            position: "absolute",
            top: "-8px",
            right: "-8px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
            fontWeight: "bold",
          },
        }
      )}
    </span>
  );
}

// Main App Component
export default function InterpolationExample() {
  return (
    <I18nProvider
      initialLanguage="en"
      translations={translations}
      languageManagerOptions={{
        defaultLanguage: "en",
        availableLanguages: [
          { code: "en", name: "English", flag: "🇺🇸" },
          { code: "ko", name: "한국어", flag: "🇰🇷" },
        ],
      }}>
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Variable Interpolation Examples</h1>

        <section style={{ marginBottom: "40px" }}>
          <BasicInterpolation />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <MultipleVariables />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <StyledVariables />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <ShoppingCart />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>Notification Badge</h2>
          <NotificationBadge unreadCount={5} />
          <span style={{ marginLeft: "20px" }}>Notifications</span>
        </section>
      </div>
    </I18nProvider>
  );
}
